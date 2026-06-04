const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  // 数字补零：{{ loop.index | idx }} → "01", "02"...
  eleventyConfig.addFilter("idx", (val) => String(val).padStart(2, "0"));

  // 日期格式化：{{ post.date | date("yyyy.MM.dd") }}
  eleventyConfig.addFilter("date", (val, format) => {
    const d = new Date(val);
    const yyyy = d.getFullYear();
    const MM   = String(d.getMonth() + 1).padStart(2, "0");
    const dd   = String(d.getDate()).padStart(2, "0");
    return (format || "yyyy.MM.dd")
      .replace("yyyy", yyyy).replace("MM", MM).replace("dd", dd);
  });

  // 截断标题
  eleventyConfig.addFilter("truncate", (str, len) =>
    str && str.length > len ? str.slice(0, len) + "…" : str
  );

  // 按日期倒序排列文章
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date);
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
