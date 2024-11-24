import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

const heroPageTranslations = {
    description: {
        en: "Popdle is a game where you test your musical knowledge and guess the songs of your favorite artists, Wordle style. Compete with your friends, challenge them and show who really knows music better. Add your friends and enjoy the competition while having fun guessing songs!",
        es: "Popdle es un juego donde pones a prueba tus conocimientos musicales y adivinas las canciones de tus artistas favoritos, al estilo de Wordle. Compite con tus amigos, desafíalos y demuestra quién realmente conoce mejor la música. ¡Agrega a tus amigos y disfruta de la competencia mientras te diviertes adivinando canciones!",
    },
    projectTitle: {
        en: "About the project",
        es: "Sobre el proyecto  "
    },
    aboutProject: {
        en: "Popdle is an academic project that was born from the idea of ​​developing an interactive game inspired by music. The main objective was to create a fun and immersive experience that allows players to enjoy music while participating in an entertaining challenge. This project seeks to combine creativity, technology and musical rhythm to offer a unique experience to users.",
        es: "Popdle es un proyecto académico que nació de la idea de desarrollar un juego interactivo inspirado en la música. El objetivo principal fue crear una experiencia divertida y envolvente que permita a los jugadores disfrutar de la música mientras participan en un desafío entretenido. Este proyecto busca combinar la creatividad, la tecnología y el ritmo musical para ofrecer una experiencia única a los usuarios.",
    },
    usTitle: {
        en: "About us",
        es: "Sobre nosotros"
    },
    aboutUs: {
        en: "We are three students of the Software Developer program, within the framework of Computer Engineering at the Catholic University of Uruguay. Our names are Juana López, Cristian Rodríguez and Juan Tanca, and we are working together on this project as part of our academic training.",
        es: "Somos tres estudiantes de la carrera de Desarrollador de Software, en el marco de la Ingeniería en Informática de la Universidad Católica del Uruguay. Nos llamamos Juana López, Cristian Rodríguez y Juan Tanca, y estamos trabajando juntos en este proyecto como parte de nuestra formación académica."
    },
    play: {
        en: "Play now",
        es: "Jugar ahora"
    }
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class HeroPageTranslator extends TranslatorService<
    typeof heroPageTranslations
> {
    public override getAllTranslations() {
        return heroPageTranslations;
    }
}
