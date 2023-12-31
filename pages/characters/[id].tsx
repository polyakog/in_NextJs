import Image from "next/image"
import { API } from "../../assets/api/api"
import { CharacterType, ResponseType } from "../../assets/api/rick-and-morty-api"
import { PageWrapper } from "../../components/PageWrapper/PageWrapper"
import { CharacterCard } from "../../components/Card/CharacterCard/CharacterCard"
import { getLayout } from "../../components/Layout/BaseLayout/BaseLayout"
import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"

export const getStaticPaths: GetStaticPaths =async () => {
    const {results} = await API.rickAndMorty.getCharacters()

    const paths = results.map(caract => ({
        params: { id: String(caract.id)}
    }))

    return {
        paths,
        // fallback: false // только загружает id первой страницы
        // fallback: 'blocking' // загружает к первой странице дополнительную страницу по запросу
        fallback: true
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {
const {id} = params || {}

    const character = await API.rickAndMorty.getCharacter(id as string)

    if (!character) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            character
        }
    }
}


type PropsType = {
    character: CharacterType
}

const Character = ({ character }: PropsType) => {

    const router = useRouter()
    if (router.isFallback) return <h1>Loading ...</h1>

    return (
        <PageWrapper>
            <CharacterCard key={character.id} character={character} />
        </PageWrapper>
    )
}

Character.getLayout = getLayout

export default Character