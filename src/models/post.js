import moment from "moment/moment";
import "moment/locale/ko";

export default class Post {
  constructor(node) {
    const { id, html, excerpt, frontmatter, fields } = node;
    const { slug } = fields;
    const { emoji, categories, title, author, date } = frontmatter;

    this.id = id;
    this.excerpt = excerpt;
    this.emoji = emoji;
    this.html = html;
    this.slug = slug;
    this.title = title;
    this.author = author;
    this.date = moment(date).format("ll");
    this.categories = categories.split(" ");
  }
}
