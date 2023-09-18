import react from "react";
import {
    BiLogoPython,
    BiLogoTypescript,
    BiLogoReact,
    BiLogoHtml5,
    BiLogoNodejs,
    BiLogoGoLang,
    BiLogoPhp,
    BiLogoJava,
    BiLogoCPlusPlus,
    BiLogoVuejs,
    // BiLogoCsharp,
    BiLogoAngular,
    // BiLogoSwift,
} from "react-icons/bi";
import { DiRuby, DiSwift } from "react-icons/di";
import { SiPerl } from "react-icons/si";
import { FaRust, FaAndroid, FaApple } from "react-icons/fa";
import { TbBrandReactNative } from "react-icons/tb";
import { SiCsharp } from "react-icons/si";

const technologies = [
    {
        label: "TypeScript",
        Icon: BiLogoTypescript,
        tech: ["TypeScript", "Node.js", "Express.js", "Socket.io"],
    },
    {
        label: "C#",
        Icon: SiCsharp,
        tech: [
            "Visual Studio",
            ".NET",
            "ASP.NET Core",
            "Unity Game Engine",
            "Entity",
        ],
    },
    {
        label: "Kotlin",
        Icon: FaAndroid,
        tech: ["Android Studio", "Ktor", "Coroutines", "Gradle", "Jetpack Compose"],
    },
    {
        label: "SwiftUI",
        Icon: DiSwift,
        tech: ["Xcode", "Swift", "SwiftUI", "Combine", "Core Data"],
    },
    {
        label: "Vue",
        Icon: BiLogoVuejs,
        tech: ["Vue.js", "Vuex", "Vue Router", "Vuetify", "Vue CLI"],
    },
    {
        label: "Python",
        Icon: BiLogoPython,
        tech: ["Django", "Flask", "NumPy", "Pandas", "TensorFlow"],
    },
    {
        label: "React",
        Icon: BiLogoReact,
        tech: ["React Library", "React Router", "Redux", "Material-UI"],
    },
    {
        label: "React Native",
        Icon: TbBrandReactNative,
        tech: ["React Native", "Expo", "React Navigation"],
    },
    {
        label: "Java",
        Icon: BiLogoJava,
        tech: ["Java", "Android Studio", "Spring", "Maven", "Hibernate"],
    },
    {
        label: "HTML5",
        Icon: BiLogoHtml5,
        tech: ["HTML5", "CSS3", "Canvas API", "WebSockets", "Semantic HTML"],
    },
    {
        label: "Node.js",
        Icon: BiLogoNodejs,
        tech: ["Node.js Runtime", "Express.js", "npm", "Socket.io", "PM2"],
    },
    {
        label: "Angular",
        Icon: BiLogoAngular,
        tech: [
            "Angular",
            "Angular CLI",
            "RxJS",
            "Angular Material",
            "Angular Universal",
        ],
    },
    {
        label: "C++",
        Icon: BiLogoCPlusPlus,
        tech: ["C++", "STL", "Boost Library", "Qt", "OpenGL"],
    },
    {
        label: "Go",
        Icon: BiLogoGoLang,
        tech: ["Go", "Gorilla Toolkit", "GORM", "Goroutines", "Docker"],
    },
    {
        label: "Swift",
        Icon: DiSwift,
        tech: ["Swift", "Xcode", "SwiftUI", "Combine", "Alamofire"],
    },
    {
        label: "Ruby",
        Icon: DiRuby,
        tech: ["Ruby", "Ruby on Rails", "RSpec", "Sinatra", "Jekyll"],
    },
    {
        label: "Rust",
        Icon: FaRust,
        tech: ["Rust", "Cargo", "Tokio", "Rocket", "Actix"],
    },
    {
        label: "PHP",
        Icon: BiLogoPhp,
        tech: ["PHP", "Laravel", "Composer", "WordPress", "Symfony"],
    },
    {
        label: "Perl",
        Icon: SiPerl,
        tech: ["Perl", "Mojolicious", "Dancer", "CPAN", "Regular Expressions"],
    },
];

export default technologies;
