import { parseURL } from 'ufo';

interface IconMapping {
    pattern: RegExp;
    icon: string;
}

const domainIconMappings: IconMapping[] = [
    // VR-SNS
    {
        pattern: /^(.*\.)?vrchat\.com$/,
        icon: 'simple-icons:vrchat',
    },

    // Social
    {
        pattern: /^(www\.)?twitter\.com$/,
        icon: 'simple-icons:twitter',
    },
    {
        pattern: /^(www\.)?x\.com$/,
        icon: 'simple-icons:x',
    },
    {
        pattern: /^(www\.)?bsky\.app$/,
        icon: 'simple-icons:bluesky',
    },
    {
        // mixi.jp -> mixi
        // mixi.social -> mixi 2
        pattern: /^(.*\.)?mixi\.(jp|social)$/,
        icon: 'entypo-social:mixi',
    },
    {
        pattern: /^(www\.)?facebook\.com$/,
        icon: 'simple-icons:facebook',
    },
    {
        pattern: /^(www\.)?discord(app)?\.com$/,
        icon: 'simple-icons:discord',
    },
    {
        pattern: /^(www\.)?instagram\.com$/,
        icon: 'simple-icons:instagram',
    },
    {
        pattern: /^(www\.)?threads\.net$/,
        icon: 'simple-icons:threads',
    },
    {
        pattern: /^(www\.)?pinterest\.com$/,
        icon: 'simple-icons:pinterest',
    },
    {
        pattern: /^(www\.)?reddit\.com$/,
        icon: 'simple-icons:reddit',
    },
    {
        pattern: /^(www\.)?tumblr\.com$/,
        icon: 'simple-icons:tumblr',
    },

    // Media
    {
        pattern: /^(www\.)?youtube\.com$/,
        icon: 'simple-icons:youtube',
    },
    {
        pattern: /^(www\.)?twitch\.tv$/,
        icon: 'simple-icons:twitch',
    },
    {
        pattern: /^(www\.)?tiktok\.com$/,
        icon: 'simple-icons:tiktok',
    },
    {
        pattern: /^(www\.)?vimeo\.com$/,
        icon: 'simple-icons:vimeo',
    },
    {
        pattern: /^(www\.)?nicovideo\.jp$/,
        icon: 'simple-icons:niconico',
    },
    {
        pattern: /^(www\.)?bilibili\.com$/,
        icon: 'simple-icons:bilibili',
    },
    {
        pattern: /^(www\.)?pixiv\.net$/,
        icon: 'simple-icons:pixiv',
    },
    {
        pattern: /^(.*\.)?artstation\.com$/,
        icon: 'simple-icons:artstation',
    },
    {
        pattern: /^(m\.)?soundcloud\.com$/,
        icon: 'simple-icons:soundcloud',
    },
    {
        pattern: /^(open\.)?spotify\.com$/,
        icon: 'simple-icons:spotify',
    },
    {
        // Short link on Dub
        pattern: /^spti\.fi$/,
        icon: 'simple-icons:spotify',
    },

    {
        pattern: /^(.*\.)?booth\.pm$/,
        icon: 'avatio:booth',
    },
    {
        // Short link on Dub
        pattern: /^dub\.(sh|link)$/,
        icon: 'avatio:dub',
    },
    {
        pattern: /^github\.com$/,
        icon: 'simple-icons:github',
    },
    {
        // Short link on Dub
        pattern: /^git\.new$/,
        icon: 'simple-icons:github',
    },
    {
        pattern: /^.*\.google\.com$/,
        icon: 'simple-icons:google',
    },
    {
        pattern: /^(www\.)?steamcommunity\.com$/,
        icon: 'simple-icons:steam',
    },
    {
        pattern: /^(www\.)?patreon\.com$/,
        icon: 'simple-icons:patreon',
    },
    {
        pattern:
            /^(www\.)?amazon\.(com|jp|co.jp|com.au|com.br|ca|fr|de|in|it|com.mx|nl|sg|es|com.tr|ae|co.uk|cn)$/,
        icon: 'simple-icons:amazon',
    },
    {
        // Short link on Dub
        pattern: /^amzn\.id$/,
        icon: 'simple-icons:amazon',
    },
    {
        pattern: /^(.*\.)?notion\.site$/,
        icon: 'simple-icons:notion',
    },
    {
        pattern: /^(www\.)?skeb\.jp$/,
        icon: 'token:skeb',
    },
];

export const getLinkIcon = (url: string) => {
    const parsed = parseURL(url);
    if (!parsed.host) return 'lucide:link';

    const host = parsed.host.toLowerCase();

    const mapping = domainIconMappings.find((m) => m.pattern.test(host));
    return mapping?.icon || 'lucide:link';
};
