const SaveInLocalStorage = ( key, value ) => {
    try {
        // Se il valore non è una stringa, lo converte in JSON
        const serializedValue = typeof value === "string" ? value : JSON.stringify ( value );

        localStorage.setItem ( key, serializedValue );
        return true; // opzionale: indica che ha salvato correttamente
    } catch (error) {
        console.error ( "Errore durante il salvataggio nel localStorage:", error );
        return false;
    }
};

export default SaveInLocalStorage;