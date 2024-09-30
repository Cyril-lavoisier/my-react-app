const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");

describe("tester API users", () => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWQ1MjQ1OTYyNDAwODJmMzYxYzY4YzciLCJpYXQiOjE3Mjc2MzQ3MTEsImV4cCI6MTcyNzg5MzkxMX0.j-za8oGaez72B1o8xrdg8HbserHKRBg_s_SOje0-1W0";
    const ARTICLE_ID = "fake";
    const USER_ID = "fake";
    const MOCK_DATA = [
      {
        _id: ARTICLE_ID,
        title: "Article 1",
        content: "An article",
        state: "draft"
      },
    ];
    const MOCK_DATA_CREATED = {
        title: "Article 1",
        content: "An article",
        state: "draft"
    };
    const MOCK_DATA_UPDATED = {
        title: "Article updated",
        content: "An article updated",
        state: "published"
    };
  
    beforeEach(() => {
      token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
      mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");


    });

  
    test("[Articles] Create", async () => {
        
        const res = await request(app)
            .post("/api/articles")
            .set("x-access-token", token);
        expect(res.status).toBe(201);
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  });