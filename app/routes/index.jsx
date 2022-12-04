import globalStyles from "~/styles/global.css";
import styles from "~/styles/index.css";
import Layout from "~/components/Layout/Layout";
import {observer} from "mobx-react";

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: styles },
    ];
}

const Index = observer(() => {
    return (
        <Layout>

        </Layout>
    );
})

export default Index