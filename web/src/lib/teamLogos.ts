const TEAM_LOGO_FALLBACKS: Record<string, string> = {
    'Arsenal': '/logos/Arsenal.png',
    'Aston Villa': '/logos/AstonVilla.png',
    'Bournemouth': '/logos/Bournemouth.png',
    'Brentford': '/logos/Brentford.png',
    'Brighton & Hove Albion': '/logos/BrightonHove.png',
    'Chelsea': '/logos/Chelsea.png',
    'Crystal Palace': '/logos/CrystalPalace.png',
    'Everton': '/logos/Everton.png',
    'Fulham': '/logos/Fulham.png',
    'Liverpool': '/logos/Liverpool.png',
    'Manchester City': '/logos/ManchesterCity.png',
    'Manchester United': '/logos/ManchesterUnited.png',
    'Newcastle United': '/logos/NewcastleUnited.png',
    'Nottingham Forest': '/logos/Nottingham Forest.png',
    'Tottenham Hotspur': '/logos/Tottenham Hotspur.png',
    'West Ham United': '/logos/West Ham United.png',
    'Wolverhampton Wanderers': '/logos/Wolverhampton Wanderers.png'
};

export function getTeamLogoUrl(teamName?: string | null, logoUrl?: string | null) {
    if (logoUrl) {
        if (logoUrl.startsWith('http')) return logoUrl;
        return logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`;
    }
    if (!teamName) return null;
    return TEAM_LOGO_FALLBACKS[teamName] ?? null;
}
