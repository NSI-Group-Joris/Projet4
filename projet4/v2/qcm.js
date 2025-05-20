const Questions= [
    [
        "Python à été crée en l'année",
        "Python à été crée par",
        "Python est un language"
    ],
    [
        "Qui a inventé le HTML",
        "Que permet le HTML",
        "Avec quel autre language est-il le plus souvent associé"
    ],
    [
        "Qui est le créateur du CSS ?",
        "Quel était le principal objectif de la création du CSS ?",
        "Quelle organisation employait Håkon Wium Lie lorsqu’il a créé le CSS ?"
    ],
    [
        "Sur quel jeu est basé de GLua ?",
        "Vrai ou faux : Le langage GLua ne permet pas de gagner de l'argent.",
        "Le GLua est un langage..."
    ]
]

const Answers = [
    [
        ["1991", "1985", "1995"],
        ["Cristiano Ronaldo", "Guido van Rossum", "Ryan Dahl"],
        ["Lent", "Simple", "Complexe"]
    ],
    [
        ["Molière", "Bill Gates", "Tim Berners-Lee"],
        ["créer des jeux vidéos", "structurer le contenu d'une page web", "Faire des calculs"],
        ["CSS", "Python", "C++"]
    ],
    [
        ["Håkon Wium Lie", "Tim Berners-Lee", "Brendan Eich"],
        ["Ajouter de la sécurité aux pages web ", "Créer un nouveau langage de programmation", "Séparer la présentation visuelle du HTML"],
        ["CERN", "NASA", "Google"]
    ],
    [
        ["Garry's Mod", "Minecraft", "Call of Duty", "Counter-Strike"],
        ["Vrai", "Faux"],
        ["de description.", "de programmation.", "système."]
    ]
]

const AnswersCorrect = [
    ["1991", "Guido van Rossum", "Simple"],
    ["Tim Berners-Lee", "structurer le contenu d'une page web", "CSS"],
    ["Håkon Wium Lie", "Séparer la présentation visuelle du HTML", "CERN"],
    ["Garry's Mod", "Faux", "de programmation."]
]

const qcmDiv = document.getElementById('QCM');
const nameEntry = document.getElementById("nameEntry");
const submitButton = document.getElementById('submit-qcm');
const restartButton = document.getElementById('restart-qcm');
let currentQCM = 0;
let initialized = false;

function Init(QCM) {
    currentQCM = QCM;

    nameEntry.value = '';  // Effacer le nom entré par l'utilisateur
    AlertMessage(''); // Effacer le message d'alerte / le score
    ResetColors(); // Amélioration - Bug fix : Remettre les réponses en blanc

    submitButton.style.display = "inline"; // Afficher le bouton de validation
    restartButton.style.display = "none"; // Masquer le bouton recommencer

    // Décocher toutes les cases
    document.querySelectorAll('fieldset input[type="radio"]').forEach(function(radio) {
        radio.checked = false; 
    });

    if (initialized != true) {
        // Appliquer le texte des questions et réponses
        for (i = 0; i < Questions[currentQCM].length; i++) {
            let question = document.getElementById('questionfield' + (i+1));
            const legend = question.querySelector("legend");
            legend.innerHTML = Questions[currentQCM][i];
            let x = 0;
            question.querySelectorAll("label").forEach(function(label) {
                label.innerHTML = Answers[currentQCM][i][x];
                x++;
            });
            x = 0;
            question.querySelectorAll("input[type='radio']").forEach(function(radio) {
                if (Answers[currentQCM][i][x] === AnswersCorrect[currentQCM][i]) {
                    radio.id="rep"+i
                }
                x++;
            });
        }
   
        initialized = true;
    }
}

function ScoreObtenu(){
    // Amélioration : Vérifie si le nom est valide
    if (isValidName(nameEntry.value) === false) {
        AlertMessage('Vous devez entrer un nom valide ! (max: 16 caractères)', 'rgb(255, 0, 0)');
        return; // Arrête la fonction si le nom est vide
    }

    // Amélioration : Vérifier si toutes les questions ont été cochées
    if (CheckAllQuestions() === false) {
        AlertMessage('Vous devez répondre à toutes les questions !', 'rgb(255, 0, 0)');
        return;
    }

    // Calculer le score
    let score = 0;
    for (let i = 0; i < Questions[currentQCM].length; i++) {
        const rep = document.getElementById('rep'+i);
        if (rep.checked === true) {
            score++; 
        }
    }

    FeedbackScore(score); // Amélioration : Feedback pour le score
    ShowAnswers(); // Amélioration : Affichage des bonnes et mauvaises réponses en couleurs
    
    submitButton.style.display = "none"; // Masquer le bouton de validation
    restartButton.style.display = "inline"; // Afficher le bouton recommencer
}

/**
    Amélioration : Feedback pour le score
*/

function FeedbackScore(score) {
    let total = Questions[currentQCM].length;
    if (score/total == 0) {
        AlertMessage("Dommage " + nameEntry.value + ", vous n'avez aucune bonne réponse! 💀", "rgb(148, 0, 0)");
    } else if (score/total < 0.5) {
        AlertMessage('Oups, il faudrait peut-être recommencer ' + nameEntry.value + ', votre score est de '+score+'/'+total+'! 😬', "rgb(255, 0, 0)");
    } else if (score/total < 1) {
        AlertMessage('Bravo ' + nameEntry.value + ', votre score est de '+score+'/'+total+'! 🧠', "rgb(255, 144, 39)");
    } else {
        AlertMessage('Parfait ' + nameEntry.value + '! Votre score est de 100% 👌', "rgb(0, 190, 0)");
    }
};

/**
    Amélioration : Texte d'alerte / de score
*/

const reponse = document.getElementById('reponse');
function AlertMessage(text, color) {
    if (text === '') {
        reponse.style.display = 'none';
    } else {
        reponse.style.color = color;
        reponse.innerHTML = text;
        reponse.style.display = 'block';
    }
}

/** 
    Amélioration : Vérifier si toutes les questions ont été cochées
*/

function CheckAllQuestions() {
    const radios = document.querySelectorAll('fieldset input[type="radio"]');
    let checked = 0;
    radios.forEach(function(radio) {
        if (radio.checked) {
            checked++;
        }
    });
    if (checked < Questions[currentQCM].length) {
        return false;
    }
    return true;
}

/**
    Amélioration : Vérifier si le nom est valide (pas vide, pas trop long)
*/

function isValidName(name) {
    const maxLength = 16; // Longueur maximale du nom
    const minLength = 1; // Longueur minimale du nom
    return name.length >= minLength && name.length <= maxLength;
}

/**
    Amélioration : Affichage des bonnes et mauvaises réponses en couleurs
*/

function ShowAnswers() {
    const Textes = document.querySelectorAll('.choix');
    for (let i = 0; i < Textes.length; i++) {
        const label = Textes[i];
        if (AnswersCorrect[currentQCM].includes(label.innerHTML)) {
            label.style.color = "rgb(0, 255, 0)";
            label.innerHTML += " ✔";
        } else {
            label.style.color = "rgb(255, 0, 0)";
            label.innerHTML += " ✘";
        }
    }
}

function ResetColors() {
    const Textes = document.querySelectorAll('.choix');
    for (let i = 0; i < Textes.length; i++) {
        Textes[i].style.color = "white";
        Textes[i].innerHTML = Textes[i].innerHTML.replace(" ✔", "");
        Textes[i].innerHTML = Textes[i].innerHTML.replace(" ✘", "");
    }
}

/**
    Amélioration : Popup déplaceable (apparition/déplacement)
*/

function ToggleQCM() {
    const overlay = document.getElementById('blur-overlay');
    if (qcmDiv.style.display === "block") {
        qcmDiv.style.display = "none";
        overlay.style.display = "none";
        return;
    } else {
        qcmDiv.style.display = "block";
        overlay.style.display = "block";
        scrollTo(0, 0);
        Init(currentQCM);
        // Center le QCM
        qcmDiv.style.left = "50%";
        qcmDiv.style.top = "50%";
    }
}

let isDragging = false;
let offsetX, offsetY;
const qcmHeader = document.getElementById('QCM-Header');

qcmHeader.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX =  qcmDiv.getBoundingClientRect().width/2 - (e.clientX - qcmDiv.getBoundingClientRect().left);
    offsetY =  qcmDiv.getBoundingClientRect().height/2 - (e.clientY - qcmDiv.getBoundingClientRect().top);
    qcmDiv.style.cursor = 'move';
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        if (e.clientX < 0 || e.clientY < 0) { return; }
        qcmDiv.style.left = (e.clientX + offsetX) + 'px'; 
        qcmDiv.style.top = (e.clientY + offsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
    qcmDiv.style.cursor = 'default';
});