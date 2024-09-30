jest.mock('../middlewares/auth', () => {
    return (req, res, next) => {
      req.user = { id: 'mockedUserId', role: 'admin' };
      next();
    };
  });

const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articlesService = require("../api/articles/articles.services");

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

      mockingoose(Article).toReturn(MOCK_DATA, "find");
      mockingoose(Article).toReturn(MOCK_DATA_UPDATED, "findOneAndUpdate");


    });

    test("[Articles] Update article", async () => {

      const res = await request(app)
        .put("/api/articles/" + ARTICLE_ID)
        .send(MOCK_DATA_UPDATED)
        .set("x-access-token", token)
        expect(res.status).toBe(200);
        expect(res.body.title).toBe(MOCK_DATA_UPDATED.title);
        expect(res.body.content).toBe(MOCK_DATA_UPDATED.content);
        expect(res.body.state).toBe(MOCK_DATA_UPDATED.state);

    });

    test("[Articles] Delete article", async () => {

      const res = await request(app)
        .delete("/api/articles/" + ARTICLE_ID)
        .set("x-access-token", token)
        expect(res.status).toBe(204);

    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  });