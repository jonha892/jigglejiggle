import { Button, Card, Col, Input, List, Row } from 'antd'
import { FC, useState } from 'react'
import usePlaylistStore, { PlaylistTrackInfo } from '../../stores/playlistStore'

type PlaylistHandleProps = {
  name: string
  content: PlaylistTrackInfo[]
}

export const PlaylistHandle: FC<PlaylistHandleProps> = ({ name, content }) => {
  const [newPlaylistName, setNewPlaylistName] = useState<string>(name)
  const renamePlaylist = usePlaylistStore((state) => state.renamePlaylist)

  const tryRename = () => {
    if (newPlaylistName !== name && newPlaylistName.length > 0) {
      console.log('renaming playlist', name, 'to', newPlaylistName)
      renamePlaylist(name, newPlaylistName)
    }
  }

  console.log('content', content)

  return (
    <Card title={name}>
      <List size="small" style={{ height: '230px', overflow: 'auto' }}>
        {content.slice(0, Math.min(5, content.length)).map((track) => (
          <List.Item key={track.id}>{track.name}</List.Item>
        ))}
      </List>
      <Row>
        <Col span={18}>
          <Input value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} />
        </Col>
        <Col span={6}>
          <Button onClick={tryRename}>rename</Button>
        </Col>
      </Row>
    </Card>
  )
}
