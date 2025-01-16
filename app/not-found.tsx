import Link from 'next/link'
 
export default function NotFound({error}: {error: string}) {
  return (
    <div>
      <h2>Errore 404</h2>
      <p>Siamo spiacenti la seguente pagina non esiste.

      </p>
      <p>{error}

      </p>
      <Link href="/">Return Home</Link>
    </div>
  )
}