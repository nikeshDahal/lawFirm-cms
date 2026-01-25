// WRONG - Returns HTMLStyleElement
useEffect(() => {
    const style = document.createElement('style');
    document.head.appendChild(style);

    return () => {
        return style; // ❌ This returns HTMLStyleElement
    };
}, []);

// CORRECT - Returns void
useEffect(() => {
    const style = document.createElement('style');
    document.head.appendChild(style);

    return () => {
        document.head.removeChild(style); // ✅ This returns void
    };
}, []);
