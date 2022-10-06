import request from "supertest";
import { app } from "../server";


interface IUser {
  firstName: string,
  lastName: string,
  email: string
}

interface IParticipant {
  user: string,
  isHost: boolean,
  isRequired: boolean,
  isAccepted: boolean
}
export interface IEvent {
  name: string,
  startAt: Date,
  endAt: Date,
  participants: Array<IParticipant>
}



const users: Array<IUser> = [
  {
    "firstName": "Mark",
    "lastName": "Wilde",
    "email": "mark@example.com"
  },
  {
    "firstName": "Alayna",
    "lastName": "Christian",
    "email": "mark@example.com"
  },
]

const newEvent: IEvent = {
  "name": "Technical interview with Helm",
  "startAt": new Date("2022-10-05T15:00:00"),
  "endAt": new Date("2022-10-05T15:30:00"),
  "participants": []
}

const invalidEvent = {
  "name": "Technical interview with Helm",
  "startAt": new Date("2022-10-05T15:00:00"),
  "participants": []
}

const participants: Array<IParticipant> = [
  {
    user: '',
    isHost: true,
    isAccepted: false,
    isRequired: true
  },
  {
    user: '',
    isHost: false,
    isAccepted: false,
    isRequired: false
  }
]

const nonExistId = '633c343ee7f20f595c383c31'
const invalidId = '123456789'

describe('GET /events', () => {
  let id: string
  let user1: string
  let user2: string
  beforeAll(async () => {
    const result1 = await request(app).post("/api/users").send(users[0])
    user1 = result1.body.data['_id']
    participants[0].user = user1

    const result2 = await request(app).post("/api/users").send(users[1])
    user2 = result2.body.data['_id']
    participants[1].user = user2
    
    newEvent['participants'] = participants
    const res = await request(app).post("/api/events").send(newEvent)
    id = res.body.data['_id']
  })

  afterAll(async() => {
    await request(app).delete(`/api/events/${id}`)
    await request(app).delete(`/api/users/${user1}`)
    await request(app).delete(`/api/users/${user1}`)
  })

  it("should return 200 if request param is empty", async () => {
    const response = await request(app).get("/api/events")
    expect(response.statusCode).toBe(200)
    expect(response.body.data.length >= 1).toBe(true)
  })

  it("should return 500 if hostId of query param is not exist",async () => {
    const response = await request(app).get(`/api/events?hostId=${invalidId}`)
    expect(response.statusCode).toBe(500)
  })

  it("should return 500 if date of query is not valid",async () => {
    const response = await request(app).get("/api/events?from=wrong")
    expect(response.statusCode).toBe(500)
  })
})


describe('GET /events/:id', () => {
  let id: string
  beforeAll(async () => {
    const res = await request(app).post("/api/events").send(newEvent)
    id = res.body.data['_id']
  })

  afterAll(async() => {
    await request(app).delete(`/api/events/${id}`)
  })

  it("should return 200 if the event id is in the list", async () => {
    const response = await request(app).get(`/api/events/${id}`)
    expect(response.statusCode).toBe(200)
  })

  it("should return 500 if the event id is not valid", async () => {
    const response = await request(app).get(`/api/events/${invalidId}`)
    expect(response.statusCode).toBe(500)
    expect(response.body['message']).toEqual(`Error retrieving event with id=${invalidId}`)
  })

  it("should return 404 if the event id is not in the list", async () => {
    const response = await request(app).get(`/api/events/${nonExistId}`)
    expect(response.statusCode).toBe(404)
    expect(response.body['message']).toEqual(`Not found event with id=${nonExistId}`)
  })
})


describe('POST /events', () => {
  let id: string

  afterAll(async () => {
    await request(app).delete(`/api/events/${id}`)
  })

  it("should add an item to events array",async () => {
    const response = await request(app).post("/api/events").send(newEvent)
    id = response.body.data['_id']
    expect(response.statusCode).toBe(201)
    expect(response.body.data['name']).toBe(newEvent['name'])
    expect(response.body.data['startAt']).toBe(newEvent['startAt'].toISOString())
  })

  it("should return 500 if request body is invalid",async () => {
    const response = await request(app).post("/api/events").send(invalidEvent)
    expect(response.statusCode).toBe(500)
  })
})

describe('PUT /events/:id', () => {
  let id: string

  beforeAll(async () => {
    const res = await request(app).post("/api/events").send(newEvent)
    id = res.body.data['_id']
  })

  afterAll(async() => {
    await request(app).delete(`/api/events/${id}`)
  })

  it("should return 200 if request data is correct", async () => {
    const response = await request(app).put(`/api/events/${id}`).send({"name": "Interview with new client"})
    expect(response.statusCode).toBe(200)
    expect(response.body['message']).toEqual("Event was updated successfully.")
  })

  it("should return 404 if event id is not exist", async () => {
    const response = await request(app).put(`/api/events/${nonExistId}`).send({"name": "Interview with new client"})
    expect(response.statusCode).toBe(404)
    expect(response.body['message']).toEqual(`Cannot update Event with id=${nonExistId}. Maybe Event was not found!`)
  })

  it("should return 500 if event id is not valid", async () => {
    const response = await request(app).put(`/api/events/${invalidId}`).send({"name": "Interview with new client"})
    expect(response.statusCode).toBe(500)
    expect(response.body['message']).toEqual(`Error updating event with id=${invalidId}`)
  })
})



let eventId: string
let user1: string
let user2: string
let userIds: Array<string> = []

describe('PUT /events/:id/add-participants', () => {

  beforeAll(async () => {
    const result1 = await request(app).post("/api/users").send(users[0])
    user1 = result1.body.data['_id']
    participants[0].user = user1
    userIds.push(user1)

    const result2 = await request(app).post("/api/users").send(users[1])
    user2 = result2.body.data['_id']
    participants[1].user = user2
    userIds.push(user2)
    
    const res = await request(app).post("/api/events").send(newEvent)
    eventId = res.body.data['_id']
  })

  it('should 200 if participants wre added successfully', async () => {
    const res = await request(app).put(`/api/events/${eventId}/add-participants`).send(participants)

    expect(res.statusCode).toBe(200)
    expect(res.body['message']).toEqual("participants were added successfully.")
  })

  it('should 404 if event is not exist in the list', async () => {
    const res = await request(app).put(`/api/events/${nonExistId}/add-participants`).send(participants)
    expect(res.statusCode).toBe(404)
    expect(res.body['message']).toEqual(`Cannot add participants with event id=${nonExistId}. Maybe Event was not found!`)
  })
})


describe('PUT /events/:id/remove-participants', () => {

  afterAll(async() => {
    await request(app).delete(`/api/events/${eventId}`)
    await request(app).delete(`/api/users/${user1}`)
    await request(app).delete(`/api/users/${user2}`)
  })

  it('should 200 if participants wre added successfully', async () => {
    const res = await request(app).put(`/api/events/${eventId}/remove-participants`).send(userIds)
    expect(res.statusCode).toBe(200)
    expect(res.body['message']).toEqual("Participants were removed from the event successfully.")
  })

  it('should 404 if event is not exist in the list', async () => {
    const res = await request(app).put(`/api/events/${nonExistId}/remove-participants`).send(userIds)
    expect(res.statusCode).toBe(404)
    expect(res.body['message']).toEqual(`Cannot remove participants with event id=${nonExistId}. Maybe Event was not found!`)
  })
})
