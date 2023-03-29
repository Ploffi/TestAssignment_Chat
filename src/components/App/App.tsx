import './App.css';
import { Messages } from '../Messages/Messages';
import { useLayoutEffect, useRef } from 'react';

function App() {
    const rootRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (!rootRef.current) return;
        rootRef.current.style.height = window.innerHeight + 'px';
    }, [rootRef.current]);

    return (
        <div ref={rootRef} className="root">
            <header className="header">
                <h3>Chat test assignment</h3>
            </header>
            <main className="main">
                <Messages />
            </main>
        </div>
    );
}

export default App;
