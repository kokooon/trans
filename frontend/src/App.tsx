import { BrowserRouter as Router } from 'react-router-dom';

import Layout from '@/lib/layout';
import Routings from '@/lib/router/Routings';
import { SocketProvider } from './lib/components/utils/socketContext';

const App = () => (
  <SocketProvider>
    <Router>
      <Layout>
        <Routings />
      </Layout>
    </Router>
    </SocketProvider>
);

export default App;
