import express from 'express';
import myRouter from '../router';
import supertest, { Response, Request } from 'supertest';
import mongoose from 'mongoose';
import { Artist, Project, ArtistLikes } from '../models/events'

// IGNORE THE TS ERRORS ON JEST FUNCTIONS

// mocks

const testProject = {
    projectOwner: 'testprojectowner',
    description: 'test project description',
    projectName: 'testproject',
    startDate: '2024-03-20T23:32:00.000Z',
    endDate: '2024-03-17T23:32:00.000Z',
    thumbImage: 'testimageurl',
    artists: []
};

const secondTestProject = {
    projectOwner: 'secondtestprojectowner',
    description: 'second test project description',
    projectName: 'secondtestproject',
    startDate: '2024-04-01T23:32:00.000Z',
    endDate: '2024-04-10T23:32:00.000Z',
    thumbImage: 'secondtestimageurl',
    artists: []
};

const testArtist = {
    name: "testArtist",
    location: "testLocation",
    rate: "testRate",
    skills: [
        "testSkill1",
        "testSkill2",
        "testSkill3"
    ],
    mainSkill: "testSkill1",
    profileImg: "https://images.unsplash.com/photo-1615572359976-1fe39507ed7b?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    work: [
        {
            description: [
                "testDescription"
            ],
            images: [
                "https://i.pinimg.com/564x/53/0a/a4/530aa4425662d0fd641dec9f3a1dfc21.jpg"
            ]
        },
        {
            description: [
                "testDescription2"
            ],
            images: [
                "https://images.pexels.com/photos/12939554/pexels-photo-12939554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            ]
        }
    ]
};

const secondTestArtist = {
    name: "secondTestArtist",
    location: "secondTestLocation",
    rate: "secondTestRate",
    skills: [
        "secondTestSkill1",
        "secondTestSkill2",
        "secondTestSkill3"
    ],
    mainSkill: "secondTestSkill1",
    profileImg: "https://images.unsplash.com/photo-1615572359976-1fe39507ed7b?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    work: [
        {
            description: [
                "secondTestDescription"
            ],
            images: [
                "https://i.pinimg.com/564x/53/0a/a4/530aa4425662d0fd641dec9f3a1dfc21.jpg"
            ]
        },
        {
            description: [
                "secondTestDescription2"
            ],
            images: [
                "https://images.pexels.com/photos/12939554/pexels-photo-12939554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            ]
        }
    ]
};


describe('Controller', () => {
    const app = express();
    app.use(express.json());
    app.use(myRouter);
    const request = supertest(app);

    beforeAll(async () => {
        await mongoose.connection.close()
        const url = `mongodb://127.0.0.1/test`;
        await mongoose.connect(url);
    });

    afterEach(async () => {
        await Project.deleteMany();
        await Artist.deleteMany();
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    it('should save a new project to the database', async () => {
        await request.post('/projects')
            .send(testProject);

        return await Project.findOne({ projectName: testProject.projectName })
            .then(project => {
                expect(project?.description).toBe(testProject.description);
            })
    })

    it('should add a new artist to the database', async () => {
        await request.post('/artists')
            .send(testArtist);

        return await Artist.findOne({ name: testArtist.name })
            .then(artist => {
                expect(artist?.name).toBe(testArtist.name);
                expect(artist?.skills.length).toEqual(3);
            })
    })

    it('should retrieve all projects', async () => {
        await request.post('/projects')
            .send(testProject);

        await request.post('/projects')
            .send(secondTestProject)

        await request.get('/projects')
            .expect(200)
            .expect((res: Response) => {
                expect(res.body.length).toEqual(2);
            })
    });

    it('should retrieve all artists', async () => {
        await request.post('/artists')
            .send(testArtist);

        await request.post('/artists')
            .send(secondTestArtist)

        await request.get('/artists')
            .expect(200)
            .expect((res: Response) => {
                expect(res.body.length).toEqual(2);
            })
    });

    it('should add an artist to a project', async () => {
        await request.post('/projects')
            .send(testProject);

        await request.post('/artists')
            .send(testArtist);

        try {
            const project = await Project.findOne({ projectName: testProject.projectName })
            const artist = await Artist.findOne({ name: testArtist.name })
            if (project && artist) {
                await request.put(`/projects/${project.id}`)
                    .send(artist)
                    .expect(201)
                    .expect((res: Response) => {
                        expect(res.body.artists.length).toEqual(1);
                    })
            }

        } catch (error) {
            console.error('Something went wrong', error)
        }

    })

})
