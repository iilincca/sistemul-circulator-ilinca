function verificaTestul() {
  let scor = 0;
  const raspunsuriCorecte = {
    q1: "b",
    q2: "c",
    q3: "c",
    q4: "c",
    q5: "a",
    q6: "b",
    q7: "c"
  };

  for (let intrebare in raspunsuriCorecte) {
    const variante = document.getElementsByName(intrebare);
    const corect = raspunsuriCorecte[intrebare];

    for (let i = 0; i < variante.length; i++) {
      const label = variante[i].parentElement;
      label.style.color = "";

      if (variante[i].checked) {
        if (variante[i].value === corect) {
          scor++;
          label.style.color = "green";
        } else {
          label.style.color = "red";
        }
      }
    }
  }

  const isRO = document.querySelector(".text-ro").style.display !== "none";
  let mesaj = "";

  if (isRO) {
    mesaj = "Ai obținut " + scor + " din 7 puncte.";
    if (scor === 7) {
      mesaj += " Felicitări! Ai răspuns corect la toate întrebările!";
    } else {
      mesaj += " Mai încearcă! Poți reciti lecția și reveni.";
    }
  } else {
    // Schimbat din 6 în 7 puncte pentru consistența baremului
    mesaj = "You got " + scor + " out of 7 points.";
    if (scor === 7) {
      mesaj += " Congratulations! You answered all questions correctly!";
    } else {
      mesaj += " Try again! You can review the lesson and come back.";
    }
  }

  document.getElementById("rezultat").innerText = mesaj;
}

function refaTestul() {
  const form = document.getElementById("quizForm");
  form.reset();

  const labels = form.querySelectorAll("label");
  labels.forEach(label => label.style.color = "");

  document.getElementById("rezultat").innerText = "";
}

let currentLang = 'ro';

function toggleLanguage() {
  currentLang = currentLang === 'ro' ? 'en' : 'ro';
  document.getElementById("languageBtn").innerText = currentLang === 'ro' ? 'EN' : 'RO';

  // Schimbarea dinamică a atributului LANG cerută de Claude
  document.documentElement.lang = currentLang;

  // Salvarea limbii în localStorage pentru persistență offline
  localStorage.setItem("siteLang", currentLang);

  const roTexts = document.querySelectorAll('.text-ro');
  const enTexts = document.querySelectorAll('.text-en');

  roTexts.forEach(el => el.style.display = currentLang === 'ro' ? 'block' : 'none');
  enTexts.forEach(el => el.style.display = currentLang === 'en' ? 'block' : 'none');

  const navLinks = document.querySelectorAll('#navbar a');
  navLinks.forEach(link => {
    const roText = link.getAttribute('data-ro');
    const enText = link.getAttribute('data-en');
    link.innerText = currentLang === 'ro' ? roText : enText;
  });
}

// Funcția care comută între modurile light și dark și salvează preferința
function toggleDarkMode() {
  document.body.classList.toggle("dark"); 
  const isDark = document.body.classList.contains("dark");

  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");

  const btn = document.getElementById("darkModeBtn");
  btn.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Când pagina se încarcă, verificăm salvările offline
window.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("darkMode");

  if (savedMode === "enabled") {
    document.body.classList.add("dark"); 
    
    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.innerText = "☀️ Light Mode"; 
  }

  // Citirea limbii salvate la încărcare
  const savedLang = localStorage.getItem("siteLang");
  if (savedLang && savedLang !== currentLang) {
    toggleLanguage();
  }
});

/* === Scroll to top – buton „↑ Sus” === */
window.onscroll = function () {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return; 
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Funcție video adaptată la noile ID-uri de resurse (Fără erori pe engleză)
function toggleVideo() {
  const isRO = document.querySelector('.text-ro').style.display !== 'none';
  const videoId = isRO ? 'videoInimaRO' : 'videoInimaEN';
  const video = document.getElementById(videoId);

  if (video) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
}

function determinaGrupa() {
  const isRO = document.querySelector(".text-ro").style.display !== "none";
  const sufix = isRO ? "-ro" : "-en";

  const antigenA = document.getElementById("antigenA" + sufix).checked;
  const antigenB = document.getElementById("antigenB" + sufix).checked;
  const anticorpA = document.getElementById("anticorpA" + sufix).checked;
  const anticorpB = document.getElementById("anticorpB" + sufix).checked;

  const rezultat = document.getElementById("rezultatGrupa" + sufix);
  const explicatie = document.getElementById("explicatieGrupa" + sufix);

  let grupa = "";
  let detalii = "";

  const antigene = [];
  const anticorpi = [];

  if (antigenA) antigene.push("A");
  if (antigenB) antigene.push("B");
  if (anticorpA) anticorpi.push("anti-A");
  if (anticorpB) anticorpi.push("anti-B");

  if (antigenA && antigenB && !anticorpA && !anticorpB) {
    grupa = "AB";
  } else if (antigenA && !antigenB && !anticorpA && anticorpB) {
    grupa = "A";
  } else if (!antigenA && antigenB && anticorpA && !anticorpB) {
    grupa = "B";
  } else if (!antigenA && !antigenB && anticorpA && anticorpB) {
    grupa = "0";
  } else {
    grupa = isRO ? "Combinare invalidă biologic" : "Invalid biological combination";
  }

  if (isRO) {
    detalii = `Ai ales: ${antigene.length ? "antigen" + (antigene.length > 1 ? "e " : " ") + antigene.join(" și ") : "niciun antigen"} pe hematii și ${anticorpi.length ? "anticorp" + (anticorpi.length > 1 ? "i " : " ") + anticorpi.join(" și ") : "niciun anticorp"} în plasmă.`;
    rezultat.textContent = `Grupa sanguină determinată: ${grupa}`;
    explicatie.textContent = detalii;
  } else {
    detalii = `You selected: ${antigene.length ? "antigen" + (antigene.length > 1 ? "s " : " ") + antigene.join(" and ") : "no antigens"} on red cells and ${anticorpi.length ? "antibod" + (anticorpi.length > 1 ? "ies " : "y ") + anticorpi.join(" and ") : "no antibodies"} in plasma.`;
    rezultat.textContent = `Determined blood type: ${grupa}`;
    explicatie.textContent = detalii;
  }
}
// Funcția care curăță simulatorul de grupe (Română + Engleză)
function reseteazaSimulatorGrupa() {
  // Debifăm căsuțele pentru Română
  document.getElementById("antigenA-ro").checked = false;
  document.getElementById("antigenB-ro").checked = false;
  document.getElementById("anticorpA-ro").checked = false;
  document.getElementById("anticorpB-ro").checked = false;

  // Debifăm căsuțele pentru Engleză
  document.getElementById("antigenA-en").checked = false;
  document.getElementById("antigenB-en").checked = false;
  document.getElementById("anticorpA-en").checked = false;
  document.getElementById("anticorpB-en").checked = false;

  // Ștergem textele de rezultat afișate pe ecran
  document.getElementById("rezultatGrupa-ro").textContent = "";
  document.getElementById("explicatieGrupa-ro").textContent = "";
  document.getElementById("rezultatGrupa-en").textContent = "";
  document.getElementById("explicatieGrupa-en").textContent = "";
}