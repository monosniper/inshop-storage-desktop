import globalStyles from "~/styles/global.css";
import styles from "~/styles/index.css";
import Layout from "~/components/Layout";

export function links() {
    return [
        { rel: "stylesheet", href: globalStyles },
        { rel: "stylesheet", href: styles },
    ];
}

export default function Index() {
  return (
    <Layout>

    </Layout>
  );
}
