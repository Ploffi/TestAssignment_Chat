import './App.css';
import { Messages } from '../Messages/Messages';

function App() {
    return (
        <div className="root">
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
