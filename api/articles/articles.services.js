const Article = require("./articles.schema");
const ObjectId = require('mongodb').ObjectId;

class ArticlesService {
  create(data) {
    const article = new Article(data.body);
    article.user = data.user;
    return article.save();
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }
  getArticleFromUser(idUser) {
    return Article.find({'user': ObjectId(idUser)}).populate("user").populate({
      path: 'user',
      select:'-password'
    });
  }
  delete(id) {
    return Article.deleteOne({ _id: id });
  }
}

module.exports = new ArticlesService();