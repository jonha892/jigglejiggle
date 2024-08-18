import { CustomerServiceOutlined, HomeOutlined } from '@ant-design/icons'
import { Button, Layout, Space, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import useSpotifyAuthStore from '../stores/authStore'
import { base64encode, generateRandomString, sha256 } from '../util/SpotifyAuth'
import { Spotify } from '../util/constants'

const { Title, Paragraph } = Typography
const { Content } = Layout

export const Welcome: React.FC = () => {
  const authStore = useSpotifyAuthStore()

  const connectWithSpotify = async () => {
    const redirectUri = Spotify.redirectUri + '/auth-callback'

    const codeVerifier = generateRandomString(64)
    window.localStorage.setItem('session_codeVerifier', codeVerifier)
    console.log('codeVerifier', codeVerifier)
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed)

    const params = {
      response_type: 'code',
      client_id: Spotify.clientId,
      scope: Spotify.scopes,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    }

    const url = new URL('https://accounts.spotify.com/authorize')
    url.search = new URLSearchParams(params).toString()
    window.location.href = url.toString()
  }

  const navigate = useNavigate()

  const isLoggedIn = authStore.isLoggedIn()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Space direction="vertical" size="large" style={{ display: 'flex', alignItems: 'center' }}>
          <Title level={1} style={{ marginBottom: 0 }}>
            jigglejiggle
          </Title>
          <Paragraph style={{ fontSize: '18px', textAlign: 'center' }}>Automatically generate Spotify playlists that make you want to jigglejiggle!</Paragraph>
          {isLoggedIn ? (
            <Button type="primary" size="large" icon={<HomeOutlined />} onClick={() => navigate('home')}>
              Go to Home Page
            </Button>
          ) : (
            <Button type="primary" size="large" icon={<CustomerServiceOutlined />} onClick={connectWithSpotify} />
          )}
        </Space>
      </Content>
    </Layout>
  )
}
