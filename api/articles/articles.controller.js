const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res, next) {
    try {
      const articles = await articlesService.create(req.body);
      res.status(201).json(articles);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const articlesModified = await articlesService.update(id, data);
      articlesModified.password = undefined;
      res.json(articlesModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      await articlesService.delete(id);
      req.io.emit("user:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();