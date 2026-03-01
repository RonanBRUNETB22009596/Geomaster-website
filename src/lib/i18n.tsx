"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Locale = "fr" | "en"

interface I18nContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
}

const translations: Record<Locale, Record<string, string>> = {
    fr: {
        // Navbar
        "nav.login": "Connexion",
        "nav.dashboard": "Tableau de bord",
        "nav.admin": "Administration",
        "nav.settings": "Paramètres",
        "nav.logout": "Se déconnecter",
        "nav.my_account": "Mon Compte",

        // Hero
        "hero.start_quiz": "Commencer le Quiz",
        "hero.leaderboard": "Leaderboard",

        // Categories
        "categories.title": "Choisissez votre défi",
        "categories.subtitle": "Sélectionnez une région pour tester vos connaissances géographiques.",
        "categories.world": "Monde Entier",
        "categories.europe": "Europe",
        "categories.americas": "Amériques",
        "categories.asia": "Asie",
        "categories.africa": "Afrique",
        "categories.oceania": "Océanie",
        "categories.label": "Catégorie",

        // Dashboard
        "dashboard.title": "Tableau de bord",
        "dashboard.subtitle": "Vos statistiques et votre progression",
        "dashboard.games": "Parties",
        "dashboard.best_score": "Meilleur score",
        "dashboard.average": "Moyenne",
        "dashboard.streak": "Streak 🔥",
        "dashboard.strikes": "strikes",
        "dashboard.mastery_map": "🌍 Carte de Maîtrise",
        "dashboard.mastery_desc": "100 scores de 8+/10 par continent pour débloquer",
        "dashboard.history": "Historique des parties",
        "dashboard.no_games": "Aucune partie jouée pour le moment.",
        "dashboard.date": "Date",
        "dashboard.category": "Catégorie",
        "dashboard.score": "Score",
        "dashboard.grade": "Note",
        "dashboard.see_more": "Voir plus",
        "dashboard.see_less": "Voir moins",
        "dashboard.others": "autres",
        "dashboard.excellent": "🏆 Excellent",
        "dashboard.good": "👍 Bien",
        "dashboard.improve": "💪 Peut mieux faire",

        // Leaderboard
        "leaderboard.title": "Classement Mondial",
        "leaderboard.subtitle": "Les meilleurs explorateurs de GeoMaster",
        "leaderboard.top20": "Top 20 Explorateurs",
        "leaderboard.balanced": "Classement équilibré : qualité + expérience",
        "leaderboard.rank": "Rang",
        "leaderboard.explorer": "Explorateur",
        "leaderboard.score": "Score",
        "leaderboard.average": "Moyenne",
        "leaderboard.games": "Parties",
        "leaderboard.record": "Record",
        "leaderboard.empty": "Aucun explorateur enregistré pour le moment. Soyez le premier !",

        // Difficulty
        "difficulty.title": "Choisissez votre défi",
        "difficulty.category_label": "Catégorie",
        "difficulty.select_level": "Sélectionnez un niveau de difficulté pour commencer votre aventure.",
        "difficulty.beginner": "Débutant",
        "difficulty.beginner_desc": "Les pays les plus connus et leurs capitales emblématiques.",
        "difficulty.intermediate": "Intermédiaire",
        "difficulty.intermediate_desc": "Un défi plus relevé avec des pays moins familiers.",
        "difficulty.professional": "Professionnel",
        "difficulty.professional_desc": "Le test ultime pour les vrais experts de la géographie.",
        "difficulty.start": "Commencer",
        "difficulty.back": "← Retour aux régions",

        // Footer
        "footer.navigation": "Navigation",
        "footer.home": "Accueil",
        "footer.start_quiz": "Démarrer un Quiz",
        "footer.my_dashboard": "Mon Tableau de Bord",
        "footer.login_signup": "Connexion / Inscription",
        "footer.categories": "Catégories",
        "footer.legal": "Légal & Support",
        "footer.terms": "Conditions d'utilisation",
        "footer.privacy": "Politique de confidentialité",
        "footer.contact": "Contactez-nous",
        "footer.rights": "Tous droits réservés.",

        // Login
        "login.welcome_back": "Bon retour !",
        "login.create_account": "Créer un compte",
        "login.login_continue": "Connectez-vous pour continuer.",
        "login.signup_continue": "Inscrivez-vous pour continuer.",
        "login.or_email": "ou via email",
        "login.forgot_password": "Mot de passe oublié ?",

        // Contact
        "contact.title": "Contactez-nous",

        // Settings
        "settings.title": "Paramètres",
    },
    en: {
        // Navbar
        "nav.login": "Login",
        "nav.dashboard": "Dashboard",
        "nav.admin": "Administration",
        "nav.settings": "Settings",
        "nav.logout": "Sign out",
        "nav.my_account": "My Account",

        // Hero
        "hero.start_quiz": "Start Quiz",
        "hero.leaderboard": "Leaderboard",

        // Categories
        "categories.title": "Choose your challenge",
        "categories.subtitle": "Select a region to test your geography knowledge.",
        "categories.world": "Whole World",
        "categories.europe": "Europe",
        "categories.americas": "Americas",
        "categories.asia": "Asia",
        "categories.africa": "Africa",
        "categories.oceania": "Oceania",
        "categories.label": "Category",

        // Dashboard
        "dashboard.title": "Dashboard",
        "dashboard.subtitle": "Your statistics and progress",
        "dashboard.games": "Games",
        "dashboard.best_score": "Best score",
        "dashboard.average": "Average",
        "dashboard.streak": "Streak 🔥",
        "dashboard.strikes": "strikes",
        "dashboard.mastery_map": "🌍 Mastery Map",
        "dashboard.mastery_desc": "100 scores of 8+/10 per continent to unlock",
        "dashboard.history": "Game history",
        "dashboard.no_games": "No games played yet.",
        "dashboard.date": "Date",
        "dashboard.category": "Category",
        "dashboard.score": "Score",
        "dashboard.grade": "Grade",
        "dashboard.see_more": "See more",
        "dashboard.see_less": "See less",
        "dashboard.others": "others",
        "dashboard.excellent": "🏆 Excellent",
        "dashboard.good": "👍 Good",
        "dashboard.improve": "💪 Can do better",

        // Leaderboard
        "leaderboard.title": "Global Ranking",
        "leaderboard.subtitle": "The best explorers of GeoMaster",
        "leaderboard.top20": "Top 20 Explorers",
        "leaderboard.balanced": "Balanced ranking: quality + experience",
        "leaderboard.rank": "Rank",
        "leaderboard.explorer": "Explorer",
        "leaderboard.score": "Score",
        "leaderboard.average": "Average",
        "leaderboard.games": "Games",
        "leaderboard.record": "Record",
        "leaderboard.empty": "No explorers registered yet. Be the first!",

        // Difficulty
        "difficulty.title": "Choose your challenge",
        "difficulty.category_label": "Category",
        "difficulty.select_level": "Select a difficulty level to start your adventure.",
        "difficulty.beginner": "Beginner",
        "difficulty.beginner_desc": "The most well-known countries and their famous capitals.",
        "difficulty.intermediate": "Intermediate",
        "difficulty.intermediate_desc": "A tougher challenge with less familiar countries.",
        "difficulty.professional": "Professional",
        "difficulty.professional_desc": "The ultimate test for true geography experts.",
        "difficulty.start": "Start",
        "difficulty.back": "← Back to regions",

        // Footer
        "footer.navigation": "Navigation",
        "footer.home": "Home",
        "footer.start_quiz": "Start a Quiz",
        "footer.my_dashboard": "My Dashboard",
        "footer.login_signup": "Login / Sign up",
        "footer.categories": "Categories",
        "footer.legal": "Legal & Support",
        "footer.terms": "Terms of use",
        "footer.privacy": "Privacy policy",
        "footer.contact": "Contact us",
        "footer.rights": "All rights reserved.",

        // Login
        "login.welcome_back": "Welcome back!",
        "login.create_account": "Create an account",
        "login.login_continue": "Login to continue.",
        "login.signup_continue": "Sign up to continue.",
        "login.or_email": "or via email",
        "login.forgot_password": "Forgot password?",

        // Contact
        "contact.title": "Contact us",

        // Settings
        "settings.title": "Settings",
    }
}

const I18nContext = createContext<I18nContextType>({
    locale: "fr",
    setLocale: () => { },
    t: (key: string) => key,
})

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("fr")

    useEffect(() => {
        const saved = localStorage.getItem("geomaster_locale") as Locale | null
        if (saved && (saved === "fr" || saved === "en")) {
            setLocaleState(saved)
        }
    }, [])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem("geomaster_locale", newLocale)
    }

    const t = (key: string): string => {
        return translations[locale][key] || key
    }

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useI18n() {
    return useContext(I18nContext)
}
