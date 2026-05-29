import { ConfigProvider } from 'antd';
import { ChatPage } from './pages';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#d4883c',
          borderRadius: 6,
        },
      }}
    >
      <ChatPage />
    </ConfigProvider>
  );
}

export default App;
