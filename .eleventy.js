const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy("src/css/dist.css");

  eleventyConfig.addFilter("idx", (val) => String(val).padStart(2, "0"));

  eleventyConfig.addFilter("date", (val, format) => {
    const d = new Date(val);
    const yyyy = d.getFullYear();
    const MM   = String(d.getMonth() + 1).padStart(2, "0");
    const dd   = String(d.getDate()).padStart(2, "0");
    return (format || "yyyy.MM.dd")
      .replace("yyyy", yyyy).replace("MM", MM).replace("dd", dd);
  });

  eleventyConfig.addFilter("truncate", (str, len) =>
    str && str.length > len ? str.slice(0, len) + "…" : str
  );

  // 按日期倒序
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date);
  });

  // 给每篇文章注入上一篇/下一篇
  eleventyConfig.addCollection("postsWithNav", function(collectionApi) {
    const posts = collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date);
    posts.forEach((post, i) => {
      post.data.prevPost = posts[i - 1] || null; // 更新的文章
      post.data.nextPost = posts[i + 1] || null; // 更旧的文章
    });
    return posts;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
