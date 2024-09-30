const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articlesService = require("./articles.services");

class ArticlesController {
  async create(req, res, next) {
    try {
      const articles = await articlesService.create(req);
      res.status(201).json(articles);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      if(req.user.role !== 'admin') {
        next(new UnauthorizedError("Not allowed to update"));
        return;
      }

      const id = req.params.id;
      const data = req.body;
      const articlesModified = await articlesService.update(id, data);
      res.status(200).json(articlesModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      if(req.user.role !== 'admin') {
        next(new UnauthorizedError("Not allowed to delete"));
        return;
      }
      const id = req.params.id;
      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async getArticleFromUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const result = await articlesService.getArticleFromUser(userId);
      console.log(result);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}



module.exports = new ArticlesController();