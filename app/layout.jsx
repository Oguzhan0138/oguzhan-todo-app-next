import './globals.css';
import { Syne } from 'next/font/google';

const syne = Syne({ subsets: ['latin'], weight: ['400', '600', '700', '800'] });

export const metadata = {
    title: 'Oguz-ToDo',
    description: 'Modern kişisel görev yönetim uygulaması',
};

export default function RootLayout({ children }) {
    return (
        <html lang="tr" data-theme="light">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css" />
            </head>
            <body className={syne.className}>
                {children}
            </body>
        </html>
    );
}
