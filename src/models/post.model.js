const mongoose = require('mongoose')
const slugify = require('slugify')
const { marked } = require('marked')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')

const dompurify = createDomPurify(new JSDOM().window)

const postSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      trim: true,
      required: true,
      maxLength: [100, 'Subject must be less then 100 words'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [150, 'Description must be less then 150 words'],
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      // required: true,
    },
    markdown: {
      type: String,
      required: true,
      trim: true,
      minLegth: [25, 'Content must be more then 25 words'],
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    sanitizedHtml: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

/**
 * Check if subject post is duplicate
 * @param {string} subject - The subject post
 * @returns {Promise<boolean>}
 */
 postSchema.statics.isSubjectDuplicate = async function (subject) {
  const post = await this.findOne({ subject });
  return !!post;
};

postSchema.pre('validate', function (next) {
  if (this.subject) {
    this.slug = slugify(this.subject, {
      lower: true,
      strict: true,
    })
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }
  
  next();
});

/**
 * @typedef Post
 */
const Post = mongoose.model('Post', postSchema)

module.exports = Post
