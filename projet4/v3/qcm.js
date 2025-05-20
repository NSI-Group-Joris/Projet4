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

let currentQCM = 0;


function Init(QCM) {
    currentQCM = QCM;

    if (!document.getElementById('QCM')) { // Si le QCM n'est pas déjà créé
        document.body.innerHTML += "<button id='open-qcm' onclick='ToggleQCM()'>Afficher le QCM</button>"; // Bouton pour afficher le QCM
        document.body.innerHTML += "<div id='QCM'></div>"; // Div pour le QCM
        document.body.innerHTML += "<div id='blur-overlay'</div>"; // Overlay pour le flou
    }

    /**
        Intérieur du QCM
    */
    
    const qcm = document.getElementById('QCM');
    qcm.innerHTML = "<div id='QCM-Header'>QCM</div>"; // En-tête du QCM
    qcm.innerHTML += "<fieldset><legend>Comment tu t'appelles ?</legend><input id='nameEntry' type='text'></fieldset>"; // Entrée du nom

    for (let i = 0; i < Questions[currentQCM].length; i++) { // Pour chaque question...
        let content = '<legend>' + Questions[currentQCM][i] + '</legend>'; // Titre de la question i
        for (let x = 0; x < Answers[currentQCM][i].length; x++) { // Pour chaque réponse à la question i...
            if (AnswersCorrect[currentQCM][i] == Answers[currentQCM][i][x]) { // Si la réponse est correcte
                content += "<input type='radio' id='rep"+i+"' name='q"+i+"'>";
            } else { // Sinon
                content += "<input type='radio' name='q"+i+"'>";
            } 
            content += "<label class='choix'>"+Answers[currentQCM][i][x]+"</label>"; // Texte de la réponse x à la question i
            content += "<br>"; // Saut de ligne
        }
        // Insertion du contenu de la question i dans un fieldset et du fieldset dans le QCM
        qcm.innerHTML += '<fieldset>'+ content +'</fieldset>'; 
    }

    // Bouton pour masquer le QCM
    qcm.innerHTML += "<button onclick='ToggleQCM()'>Fermer</button>";
    // Bouton pour soumettre le QCM
    qcm.innerHTML += "<button id='submit-qcm' onclick='ScoreObtenu()'>Valider</button>";
    // Bouton pour réinitialiser le QCM
    qcm.innerHTML += "<button id='restart-qcm' onclick='Init("+currentQCM+")'>Recommencer</button>";

    // Texte pour afficher le score
    qcm.innerHTML += "<div id='reponse'></div>";

    MovableQCM();
}

function ScoreObtenu(){
    const qcm = document.getElementById('QCM');

    // Amélioration : Vérifie si le nom est valide
    if (isValidName(document.getElementById("nameEntry").value) === false) {
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

    const submitButton = document.getElementById('submit-qcm');
    submitButton.style.display = "none"; // Masquer le bouton de validation
    const restartButton = document.getElementById('restart-qcm');
    restartButton.style.display = "inline"; // Afficher le bouton recommencer
}

/**
    Amélioration : Feedback pour le score
*/

function FeedbackScore(score) {
    const nameEntry = document.getElementById("nameEntry");
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

function AlertMessage(text, color) {
    const reponse = document.getElementById('reponse');
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
    Amélioration : Fonctions pour afficher, masquer et déplacer le QCM
*/

function ToggleQCM() {
    const qcm = document.getElementById('QCM');
    const overlay = document.getElementById('blur-overlay');
    if (qcm.style.display === "block") {
        qcm.style.display = "none";
        overlay.style.display = "none";
        return;
    } else {
        qcm.style.display = "block";
        overlay.style.display = "block";
        scrollTo(0, 0);
    }
}

function MovableQCM() {
    let isDragging = false;
    let offsetX, offsetY;

    const qcm = document.getElementById('QCM');
    const qcmHeader = document.getElementById('QCM-Header');

    qcmHeader.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX =  qcm.getBoundingClientRect().width/2 - (e.clientX - qcm.getBoundingClientRect().left);
        offsetY =  qcm.getBoundingClientRect().height/2 - (e.clientY - qcm.getBoundingClientRect().top);
        qcm.style.cursor = 'move';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            if (e.clientX < 0 || e.clientY < 0) { return; }
            qcm.style.left = (e.clientX + offsetX) + 'px'; 
            qcm.style.top = (e.clientY + offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        qcm.style.cursor = 'default';
    });
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
    }
}