const btn__start = document.querySelector(".btn__start");
const input__playerName = document.querySelector("#playerName");

var data = {
    name: "Hello",
    mode: "single",
    score: 0,
    speed: "slow",
};

var handleInputChange = (e) => {
    data[e.target.name] = e.target.value;
    console.log(data.speed);
};

var handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("name", data.name);
    localStorage.setItem("speed", data.speed);
    window.location = "game.html";
};

