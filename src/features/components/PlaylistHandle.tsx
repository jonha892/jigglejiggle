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

  return (
    <>
      <h5>{name}</h5>
      <input value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} />
      <ul>
        {content.slice(0, Math.min(5, content.length)).map((track) => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
      <button onClick={tryRename}>rename</button>
      <div></div>
    </>
  )
}
