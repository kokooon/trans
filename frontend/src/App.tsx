import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './lib/components/utils/UserContext';
import Layout from '@/lib/layout';
import Routings from '@/lib/router/Routings';
import { SocketProvider } from './lib/components/utils/socketContext';

const App = () => (
  <UserProvider>
    <SocketProvider>
      <Router>
        <Layout>
          <Routings />
        </Layout>
      </Router>
      </SocketProvider>
    </UserProvider>
);

export default App;
