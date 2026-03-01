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
        "nav.leaderboard": "Classement",

        // Hero
        "hero.title": "Devenez un pro de la géo",
        "hero.subtitle": "Testez vos connaissances sur les capitales, drapeaux, et populations avec notre quiz interactif de 10 questions.",
        "hero.start_quiz": "Commencer le Quiz",
        "hero.leaderboard": "Leaderboard",

        // Maintenance
        "maintenance.title": "Site en Maintenance",
        "maintenance.desc": "Nous effectuons des améliorations. Le site sera bientôt de retour !",
        "maintenance.back_soon": "Revenez bientôt",

        // Categories
        "categories.title": "Choisissez votre défi",
        "categories.subtitle": "Sélectionnez une région pour tester vos connaissances géographiques.",
        "categories.label": "Catégorie",
        "categories.world": "Quiz - Monde",
        "categories.europe": "Quiz - Europe",
        "categories.americas": "Quiz - Amériques",
        "categories.asia": "Quiz - Asie",
        "categories.africa": "Quiz - Afrique",
        "categories.oceania": "Quiz - Océanie",

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
        "footer.americas": "Amériques",
        "footer.asia": "Asie",
        "footer.africa": "Afrique",
        "footer.oceania": "Océanie",
        "footer.legal": "Légal & Support",
        "footer.terms": "Conditions d'utilisation",
        "footer.privacy": "Politique de confidentialité",
        "footer.contact": "Contactez-nous",
        "footer.rights": "Tous droits réservés.",
        "footer.status": "Status: En ligne",

        // Login
        "login.welcome_back": "Bon retour !",
        "login.create_account": "Créer un compte",
        "login.verification": "Vérification",
        "login.reset": "Réinitialisation",
        "login.login_continue": "Connectez-vous pour continuer.",
        "login.signup_continue": "Inscrivez-vous pour continuer.",
        "login.enter_code": "Entrez le code reçu par email.",
        "login.enter_email_reset": "Entrez votre email pour réinitialiser.",
        "login.or_email": "ou via email",
        "login.forgot_password": "Mot de passe oublié ?",
        "login.password": "Mot de passe",
        "login.code_placeholder": "Code de vérification",
        "login.verify": "Vérifier le code",
        "login.signing_in": "Connexion en cours...",
        "login.sign_in": "Se connecter",
        "login.sign_up": "S'inscrire",
        "login.send_link": "Envoyer le lien",
        "login.back_login": "Retour à la connexion",
        "login.no_account": "Pas encore de compte ?",
        "login.signup_now": "Inscrivez-vous",
        "login.has_account": "Déjà un compte ?",
        "login.login_now": "Connectez-vous",
        "login.password_min": "8 caractères minimum",
        "login.password_upper": "1 majuscule",
        "login.password_number": "1 chiffre",
        "login.password_special": "1 caractère spécial",
        "login.remember_me": "Se souvenir de moi",
        "login.back_home": "← Retour à l'accueil",

        // Contact
        "contact.title": "Contactez-nous",
        "contact.subtitle": "Une question, un bug à signaler ou une suggestion d'amélioration ? N'hésitez pas à nous envoyer un message !",
        "contact.email": "Email",
        "contact.office": "Bureau",
        "contact.send_message": "Envoyez un message",
        "contact.form_desc": "Remplissez le formulaire ci-dessous et nous vous répondrons dans les 24h.",
        "contact.full_name": "Nom complet",
        "contact.name_placeholder": "Ex: Jean Dupont",
        "contact.email_address": "Adresse Email",
        "contact.email_placeholder": "Ex: jean@example.com",
        "contact.subject": "Sujet",
        "contact.subject_placeholder": "Ex: Suggestion de nouvelle catégorie",
        "contact.message": "Message",
        "contact.message_placeholder": "Comment pouvons-nous vous aider ?",
        "contact.send": "Envoyer le message",
        "contact.opening_email": "Ouverture de votre messagerie...",

        // Settings
        "settings.title": "Paramètres",
        "settings.subtitle": "Gérez votre profil et vos préférences",
        "settings.profile": "Profil",
        "settings.profile_desc": "Personnalisez votre profil visible par les autres joueurs.",
        "settings.username": "Nom d'utilisateur",
        "settings.avatar": "Photo de profil",
        "settings.change_avatar": "Changer la photo",
        "settings.save": "Enregistrer les modifications",
        "settings.saving": "Enregistrement...",
        "settings.security": "Sécurité",
        "settings.security_desc": "Modifiez votre mot de passe.",
        "settings.new_password": "Nouveau mot de passe",
        "settings.update_password": "Mettre à jour le mot de passe",
        "settings.danger_zone": "Zone Dangereuse",
        "settings.danger_desc": "Supprimez définitivement votre compte et toutes vos données.",
        "settings.delete_account": "Supprimer mon compte",
        "settings.confirm_delete": "Êtes-vous sûr ? Cette action est irréversible.",

        // Results
        "results.title": "Résultats",
        "results.your_score": "Votre score",
        "results.play_again": "Rejouer",
        "results.back_home": "Retour à l'accueil",
        "results.correct_answers": "Bonnes réponses",
        "results.excellent": "Excellent ! 🏆",
        "results.good": "Bien joué ! 👍",
        "results.keep_going": "Continuez vos efforts ! 💪",

        // Quiz
        "quiz.question": "Question",
        "quiz.quit": "Quitter",
        "quiz.next": "Suivant",
        "quiz.confirm": "Valider",

        // Update Password
        "update_password.title": "Nouveau mot de passe",
        "update_password.desc": "Choisissez un nouveau mot de passe sécurisé pour votre compte.",
        "update_password.new_password": "Nouveau mot de passe",
        "update_password.confirm": "Confirmer le mot de passe",
        "update_password.save": "Enregistrer",
        "update_password.password_min_error": "Le mot de passe doit contenir au moins 8 caractères.",
        "update_password.password_mismatch": "Les mots de passe ne correspondent pas.",
        "update_password.password_updated": "Mot de passe mis à jour avec succès !",
    },
    en: {
        // Navbar
        "nav.login": "Login",
        "nav.dashboard": "Dashboard",
        "nav.admin": "Administration",
        "nav.settings": "Settings",
        "nav.logout": "Sign out",
        "nav.my_account": "My Account",
        "nav.leaderboard": "Leaderboard",

        // Hero
        "hero.title": "Become a geography pro",
        "hero.subtitle": "Test your knowledge on capitals, flags, and populations with our interactive 10-question quiz.",
        "hero.start_quiz": "Start Quiz",
        "hero.leaderboard": "Leaderboard",

        // Maintenance
        "maintenance.title": "Site Under Maintenance",
        "maintenance.desc": "We are making improvements. The site will be back soon!",
        "maintenance.back_soon": "Come back soon",

        // Categories
        "categories.title": "Choose your challenge",
        "categories.subtitle": "Select a region to test your geography knowledge.",
        "categories.label": "Category",
        "categories.world": "Quiz - World",
        "categories.europe": "Quiz - Europe",
        "categories.americas": "Quiz - Americas",
        "categories.asia": "Quiz - Asia",
        "categories.africa": "Quiz - Africa",
        "categories.oceania": "Quiz - Oceania",

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
        "footer.americas": "Americas",
        "footer.asia": "Asia",
        "footer.africa": "Africa",
        "footer.oceania": "Oceania",
        "footer.legal": "Legal & Support",
        "footer.terms": "Terms of use",
        "footer.privacy": "Privacy policy",
        "footer.contact": "Contact us",
        "footer.rights": "All rights reserved.",
        "footer.status": "Status: Online",

        // Login
        "login.welcome_back": "Welcome back!",
        "login.create_account": "Create an account",
        "login.verification": "Verification",
        "login.reset": "Password Reset",
        "login.login_continue": "Login to continue.",
        "login.signup_continue": "Sign up to continue.",
        "login.enter_code": "Enter the code received by email.",
        "login.enter_email_reset": "Enter your email to reset your password.",
        "login.or_email": "or via email",
        "login.forgot_password": "Forgot password?",
        "login.password": "Password",
        "login.code_placeholder": "Verification code",
        "login.verify": "Verify code",
        "login.signing_in": "Signing in...",
        "login.sign_in": "Sign in",
        "login.sign_up": "Sign up",
        "login.send_link": "Send link",
        "login.back_login": "Back to login",
        "login.no_account": "Don't have an account?",
        "login.signup_now": "Sign up",
        "login.has_account": "Already have an account?",
        "login.login_now": "Sign in",
        "login.password_min": "8 characters minimum",
        "login.password_upper": "1 uppercase letter",
        "login.password_number": "1 number",
        "login.password_special": "1 special character",
        "login.remember_me": "Remember me",
        "login.back_home": "← Back to home",

        // Contact
        "contact.title": "Contact us",
        "contact.subtitle": "Have a question, a bug to report, or a suggestion? Don't hesitate to send us a message!",
        "contact.email": "Email",
        "contact.office": "Office",
        "contact.send_message": "Send a message",
        "contact.form_desc": "Fill out the form below and we'll get back to you within 24 hours.",
        "contact.full_name": "Full name",
        "contact.name_placeholder": "E.g.: John Doe",
        "contact.email_address": "Email address",
        "contact.email_placeholder": "E.g.: john@example.com",
        "contact.subject": "Subject",
        "contact.subject_placeholder": "E.g.: New category suggestion",
        "contact.message": "Message",
        "contact.message_placeholder": "How can we help you?",
        "contact.send": "Send message",
        "contact.opening_email": "Opening your email client...",

        // Settings
        "settings.title": "Settings",
        "settings.subtitle": "Manage your profile and preferences",
        "settings.profile": "Profile",
        "settings.profile_desc": "Customize your profile visible to other players.",
        "settings.username": "Username",
        "settings.avatar": "Profile picture",
        "settings.change_avatar": "Change photo",
        "settings.save": "Save changes",
        "settings.saving": "Saving...",
        "settings.security": "Security",
        "settings.security_desc": "Change your password.",
        "settings.new_password": "New password",
        "settings.update_password": "Update password",
        "settings.danger_zone": "Danger Zone",
        "settings.danger_desc": "Permanently delete your account and all your data.",
        "settings.delete_account": "Delete my account",
        "settings.confirm_delete": "Are you sure? This action is irreversible.",

        // Results
        "results.title": "Results",
        "results.your_score": "Your score",
        "results.play_again": "Play again",
        "results.back_home": "Back to home",
        "results.correct_answers": "Correct answers",
        "results.excellent": "Excellent! 🏆",
        "results.good": "Well done! 👍",
        "results.keep_going": "Keep it up! 💪",

        // Quiz
        "quiz.question": "Question",
        "quiz.quit": "Quit",
        "quiz.next": "Next",
        "quiz.confirm": "Confirm",

        // Update Password
        "update_password.title": "New password",
        "update_password.desc": "Choose a new secure password for your account.",
        "update_password.new_password": "New password",
        "update_password.confirm": "Confirm password",
        "update_password.save": "Save",
        "update_password.password_min_error": "Password must be at least 8 characters.",
        "update_password.password_mismatch": "Passwords do not match.",
        "update_password.password_updated": "Password updated successfully!",
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
