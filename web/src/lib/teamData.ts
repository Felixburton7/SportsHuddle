
export interface TeamStaticData {
    id: string; // short_name
    primaryColor: string;
    secondaryColor: string;
    established: string;
    stadium: string;
    website?: string;
}

export const TEAM_DATA: Record<string, TeamStaticData> = {
    'ARS': {
        id: 'ARS',
        primaryColor: '#EF0107',
        secondaryColor: '#063672',
        established: '1886',
        stadium: 'Emirates Stadium',
        website: 'https://www.arsenal.com'
    },
    'AVL': {
        id: 'AVL',
        primaryColor: '#95BFE5',
        secondaryColor: '#670E36',
        established: '1874',
        stadium: 'Villa Park',
        website: 'https://www.avfc.co.uk'
    },
    'BOU': {
        id: 'BOU',
        primaryColor: '#DA291C',
        secondaryColor: '#000000',
        established: '1899',
        stadium: 'Vitality Stadium',
        website: 'https://www.afcb.co.uk'
    },
    'BRE': {
        id: 'BRE',
        primaryColor: '#E30613',
        secondaryColor: '#F9F9F9',
        established: '1889',
        stadium: 'Gtech Community Stadium',
        website: 'https://www.brentfordfc.com'
    },
    'BHA': {
        id: 'BHA',
        primaryColor: '#0057B8',
        secondaryColor: '#FFFFFF',
        established: '1901',
        stadium: 'Amex Stadium',
        website: 'https://www.brightonandhovealbion.com'
    },
    'BUR': {
        id: 'BUR',
        primaryColor: '#6C1D45',
        secondaryColor: '#99D6EA',
        established: '1882',
        stadium: 'Turf Moor',
        website: 'https://www.burnleyfootballclub.com'
    },
    'CHE': {
        id: 'CHE',
        primaryColor: '#034694',
        secondaryColor: '#EE242C',
        established: '1905',
        stadium: 'Stamford Bridge',
        website: 'https://www.chelseafc.com'
    },
    'CRY': {
        id: 'CRY',
        primaryColor: '#1B458F',
        secondaryColor: '#C4122E',
        established: '1905',
        stadium: 'Selhurst Park',
        website: 'https://www.cpfc.co.uk'
    },
    'EVE': {
        id: 'EVE',
        primaryColor: '#003399',
        secondaryColor: '#FFFFFF',
        established: '1878',
        stadium: 'Goodison Park',
        website: 'https://www.evertonfc.com'
    },
    'FUL': {
        id: 'FUL',
        primaryColor: '#000000',
        secondaryColor: '#CC0000',
        established: '1879',
        stadium: 'Craven Cottage',
        website: 'https://www.fulhamfc.com'
    },
    'LIV': {
        id: 'LIV',
        primaryColor: '#C8102E',
        secondaryColor: '#00B2A9',
        established: '1892',
        stadium: 'Anfield',
        website: 'https://www.liverpoolfc.com'
    },
    'LUT': {
        id: 'LUT',
        primaryColor: '#F78F1E',
        secondaryColor: '#000000',
        established: '1885',
        stadium: 'Kenilworth Road',
        website: 'https://www.lutontown.co.uk'
    },
    'MCI': {
        id: 'MCI',
        primaryColor: '#6CABDD',
        secondaryColor: '#1C2C5B',
        established: '1880',
        stadium: 'Etihad Stadium',
        website: 'https://www.mancity.com'
    },
    'MUN': {
        id: 'MUN',
        primaryColor: '#DA291C',
        secondaryColor: '#FBE122',
        established: '1878',
        stadium: 'Old Trafford',
        website: 'https://www.manutd.com'
    },
    'NEW': {
        id: 'NEW',
        primaryColor: '#241F20',
        secondaryColor: '#F1BE48',
        established: '1892',
        stadium: 'St. James\' Park',
        website: 'https://www.nufc.co.uk'
    },
    'NFO': {
        id: 'NFO',
        primaryColor: '#DD0000',
        secondaryColor: '#FFFFFF',
        established: '1865',
        stadium: 'City Ground',
        website: 'https://www.nottinghamforest.co.uk'
    },
    'SHU': {
        id: 'SHU',
        primaryColor: '#EE2737',
        secondaryColor: '#000000',
        established: '1889',
        stadium: 'Bramall Lane',
        website: 'https://www.sufc.co.uk'
    },
    'TOT': {
        id: 'TOT',
        primaryColor: '#132257',
        secondaryColor: '#FFFFFF',
        established: '1882',
        stadium: 'Tottenham Hotspur Stadium',
        website: 'https://www.tottenhamhotspur.com'
    },
    'WHU': {
        id: 'WHU',
        primaryColor: '#7A263A',
        secondaryColor: '#1BB1E7',
        established: '1895',
        stadium: 'London Stadium',
        website: 'https://www.whufc.com'
    },
    'WOL': {
        id: 'WOL',
        primaryColor: '#FDB913',
        secondaryColor: '#231F20',
        established: '1877',
        stadium: 'Molineux Stadium',
        website: 'https://www.wolves.co.uk'
    },
    'IPS': {
        id: 'IPS',
        primaryColor: '#0054A6',
        secondaryColor: '#FFFFFF',
        established: '1878',
        stadium: 'Portman Road',
        website: 'https://www.itfc.co.uk'
    },
    'SOU': {
        id: 'SOU',
        primaryColor: '#D71920',
        secondaryColor: '#FFFFFF',
        established: '1885',
        stadium: 'St Mary\'s Stadium',
        website: 'https://www.southamptonfc.com'
    },
    'LEI': {
        id: 'LEI',
        primaryColor: '#0053A0',
        secondaryColor: '#FDBE11',
        established: '1884',
        stadium: 'King Power Stadium',
        website: 'https://www.lcfc.com'
    },
    'LEE': {
        id: 'LEE',
        primaryColor: '#FFCD00',
        secondaryColor: '#1D428A',
        established: '1919',
        stadium: 'Elland Road',
        website: 'https://www.leedsunited.com'
    }
};

export function getTeamStaticData(shortName: string): TeamStaticData | null {
    return TEAM_DATA[shortName] || null;
}
