const getSelectedValues = () => {
    let subject = document.querySelector("#subject").value;
    let year = document.querySelector("#year").value;
    let page = document.querySelector("#page").value;
    
    if(subject && year && page){
        let url = `http://localhost:3000/get_questions?subject=${subject}&year=${year}&page=${page}`
        console.log(subject, year, page);
        fetch(url)
        .then(response => response.json())
        .then(data => {
            displayContents(data)
        })
    } else {
        console.log("a value is missing");
    }
}

const displayContents = (data) => {
    let image = document.querySelector("#image");
    let instruction = document.querySelector("#instruction");
    let question = document.querySelector("#question");
    let opt_a = document.querySelector("#opt_a");
    let opt_b = document.querySelector("#opt_b");
    let opt_c = document.querySelector("#opt_c");
    let opt_d = document.querySelector("#opt_d");
    let answer = document.querySelector("#answer");
    let explanation = document.querySelector("#explanation");

    let que_data = data.data[0];
    console.log(data.data[0]);

    question.innerHTML = que_data.question.title;
    opt_a.value = que_data.details.options.a;
    opt_b.value = que_data.details.options.b;
    opt_c.value = que_data.details.options.c;
    opt_d.value = que_data.details.options.d;
    answer.value = que_data.answer.answer;
    explanation.innerHTML = que_data.answer.explanation;
    instruction.innerHTML = que_data.details.instruction;
}