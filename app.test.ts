// app.test.ts
import request from 'supertest'
import { server } from "."

describe('Test des routes Express', () => {

    it("Création d'un utilisateur", async () => {
        const response = await request(server).post("/user").send({ email: "test@test.com", pseudo: "test", password: "password" })
        expect(response.status).toBe(201)
    })

    it("Connexion de l'admin", async () => {
        const response = await request(server).post("/user").send({ email: "admin@admin.com", password: "password" })
        expect(response.status).toBe(200)
    })

    it("Création de deux gares", async () => {
        const response1 = await request(server).post("/trainstation").send({ name: "gare1", openHour: "10:10", closeHour: "22:22" })
        expect(response1.status).toBe(201)
        const response2 = await request(server).post("/trainstation").send({ name: "gare2", openHour: "10:10", closeHour: "22:22" })
        expect(response2.status).toBe(201)
    })

    it("Création d'un train", async () => {
        const response = await request(server).post("/train").send({ name: "train", startStation: "gare1", endStation: "gare2", timeOfDeparture: "13:00" })
        expect(response.status).toBe(201)
    })

    it("Création d'un ticket", async () => {
        const response = await request(server).get("/ticket").send({ startStation: "gare1", endStation: "gare2", timeOfDeparture: "13:00" })
        expect(response.status).toBe(200)
    })

})
