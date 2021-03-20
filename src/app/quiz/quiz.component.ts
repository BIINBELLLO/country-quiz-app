import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { QuestionType } from "../models/question-type.enum";
import { QuizService } from "../services/quiz.service";

@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.scss"],
})
export class QuizComponent implements OnInit {
  checkedList = [
    {
      id: 1,
      name: "Vietnam",
      selected: false,
    },
    {
      id: 2,
      name: "Austria",
      selected: false,
    },
    {
      id: 3,
      name: "Russia",
      selected: false,
    },
    {
      id: 4,
      name: "Brazil",
      selected: false,
    },
  ];

  countries: Array<any> = [];
  countryinUse: any = null;
  selectedAnswer: any = null;
  maxCountryIndex = 250;
  maxQuestionType = 2;
  questionType = QuestionType;
  questionToDisplay = {
    sentence: "",
    type: 0,
    options: [],
  };
  quizScore = 0;
  viewingQuestions = true;

  constructor(
    private spinner: NgxSpinnerService,
    private quizService: QuizService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllCountries();
  }

  getAllCountries() {
    this.spinner.show();
    this.quizService.getAllCountriesData().subscribe({
      next: (response) => {
        this.spinner.hide();
        this.countries = response;
        this.countryinUse = this.countries[this.getRandomCountryIndex()];
        // console.log(this.countryinUse);
        this.formulateQuestionFromCountryInUse();
      },
      error: (e) => {
        this.spinner.hide();
        alert("Error, please try again!");
      },
    });
  }

  getRandomCountryIndex() {
    return Math.floor(Math.random() * Math.floor(this.maxCountryIndex));
  }

  getRandomQuestionType() {
    return Math.floor(Math.random() * Math.floor(this.maxQuestionType));
  }

  navigateNextQuestion() {
    this.countryinUse = this.countries[this.getRandomCountryIndex()];
    // console.log(this.countryinUse);
    this.selectedAnswer = null;
    this.formulateQuestionFromCountryInUse();
  }

  formulateQuestionFromCountryInUse() {
    const type = this.getRandomQuestionType();
    if (type === this.questionType.Capital) {
      this.questionToDisplay = {
        sentence: `${this.countryinUse.capital} is the capital of?`,
        type,
        options: this.generateOptions(),
      };
    } else {
      this.questionToDisplay = {
        sentence: `The flag above belongs to which country?`,
        type,
        options: this.generateOptions(),
      };
    }
  }

  generateOptions() {
    let options = [
      { value: this.countryinUse.name, isAnswer: true, selected: false },
    ];

    while (options.length !== 4) {
      options = [
        ...options,
        {
          value: this.countries[this.getRandomCountryIndex()].name,
          isAnswer: false,
          selected: false,
        },
      ];
    }

    return this.shuffle(options);
  }

  selectAnswer(option) {
    // console.log(option);
    this.questionToDisplay.options.forEach((el) => {
      el.value === option.value ? (el.selected = true) : (el.selected = false);
    });
    this.validateAnswer();
  }

  validateAnswer() {
    this.selectedAnswer = this.questionToDisplay.options.find((el) => {
      return el.selected === true;
    });

    if (this.selectedAnswer.isAnswer === true) {
      this.quizScore++;
      this.toastr.success(
        "Current Score: " + this.quizScore.toString(),
        "Correct"
      );
    } else {
      this.toastr.error("That was wrong! Calculating result!", "Ouch!!");
      setTimeout(() => {
        this.selectedAnswer = null;
        this.viewingQuestions = false;
      }, 2000);
    }

    // console.log(this.selectedAnswer);
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  resetAndTryAgain() {
    this.quizScore = 0;
    this.viewingQuestions = true;
    this.navigateNextQuestion();
  }
}
