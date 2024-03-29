const axios = require('axios');
const cheerio = require('cheerio');

const scrapePage = async (url) => await axios(url);

const getPastQuestions = async (subject, year, page) => {
    let url = `https://nigerianscholars.com/past-questions/${subject}/waec/year/${year}/answers/hide/page/${page}/`;
    let response = await scrapePage(url)
    return extractData(response.data, year, subject);
}

const extractData = (html, year, subject) => {
    let $ = cheerio.load(html);
    let question_div = $(`.question_block`);
    let question_div_keys = Object.keys(question_div);
    let que_on_page_cnt = 0;
    let data = [];
    
    question_div_keys.forEach(ele => {
        if(ele < 10){
            let parent_id = question_div[ele].attribs.id;
            let question = $(`#${parent_id} .question_text`).text();
            let que_image = $(`#${parent_id} .question_text p img`);
            let answer = $(`#${parent_id} #ans-label`).text();
            let explanation = $(`#${parent_id} .q_explanation_text p`).text();
            let opt_a = $(`#${parent_id} .question_content h3`).next().text();
            let opt_b = $(`#${parent_id} .question_content h3`).next().next().text();
            let opt_c = $(`#${parent_id} .question_content h3`).next().next().next().text();
            let opt_d = $(`#${parent_id} .question_content h3`).next().next().next().next().text();
            let topics = $(`#${parent_id} .recommended_lesson`);
            let resources = $(`#${parent_id} .recommended_lesson`);

            if(topics.length > 0){
                topics = $(`#${parent_id} .recommended_lesson`).text().split(":")[1].split("|");
                opt_a = opt_a.split(")")[1].trim();
                opt_b = opt_b.split(")")[1].trim();
                opt_c = opt_c.split(")")[1].trim();
                opt_d = opt_d.split(")")[1].trim();

                let obj1 = {
                    topic: topics[0].trim(),
                    link: resources[0].children[1].attribs.href
                };

                let obj2 = {
                    topic: topics[1].trim(),
                    link: resources[0].children[3].attribs.href
                };

                topics = [obj1, obj2];
            } else {
                topics = []
            }

            if(que_image.length > 0){
                que_image = que_image[0].attribs.src;
            } else {
                que_image = "";
            }

            if(explanation.length < 1){
                explanation = ""
            }

            let new_obj = {
                answer: {
                    answer: answer,
                    explanation: explanation.trim()
                },
                details: {
                    year: year,
                    period: "",
                    instruction: "",
                    options: {
                        a: opt_a,
                        b: opt_b,
                        c: opt_c,
                        d: opt_d
                    },
                    question_img: que_image
                },
                question: {
                    title: question.trim(),
                    subject: subject,
                    topics: topics
                }
            }

            data.push(new_obj);
            que_on_page_cnt += 1;
        }
    })

    return ({num_of_question: que_on_page_cnt, data: data});
}

const home = (req, res) => {
    res.render("index");
}

const startScraping = (req, res) => {
    let subject = req.query.subject;
    let year = req.query.year;
    let page = req.query.page;

    getPastQuestions(subject, year, page)
        .then(result => res.send(result))
}

module.exports = { startScraping, home };