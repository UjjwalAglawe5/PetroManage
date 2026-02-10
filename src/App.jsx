import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Layout} from './pages/Layout';
import {Dashboard} from './pages/Dashboard';
import {Assets} from './pages/Assets';
import { Production } from './pages/Production';
import { Compliance } from './pages/Compliance';
import {Analytics} from './pages/Analytics';
import { Maintenance } from './pages/Maintenance';
import { StatusView } from './components/maintenance components/StatusView';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Everything inside this Route will use Layout comp */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="assets" element={<Assets />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="production" element={<Production />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="/maintenance/status" element={<StatusView />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="profile" element={<Profile />} />
          {/* <Route path="analytics" element={<Analytics />} /> */}
        </Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Registration/>}/>
        <Route path="/forgot" element={<ForgotPassword/>}/>
      </Routes>
    </BrowserRouter>
  );
}


export default App;