import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'DirtyCode',
        short_name: 'DirtyCode',
        description: 'A vida real do dev não é clean.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/logo.webp',
                sizes: '192x192',
                type: 'image/webp',
            },
            {
                src: '/logo.webp',
                sizes: '512x512',
                type: 'image/webp',
            },
        ],
    }
}
