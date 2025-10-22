import { Document } from '../types';

const pad = (num: number, size: number): string => {
    let s = num.toString();
    while (s.length < size) s = "0" + s;
    return s;
}

const MOCK_CONTENT = [
    "Project Titan experienced a setback during phase 2 safety trials. The primary actuator failed under stress testing at 80% capacity.",
    "Email chain discussing the Q3 financial results. Performance is above target.",
    "Minutes from the board meeting on October 5th. Key discussion point was the potential acquisition of Innovate Inc.",
    "Memo regarding new company-wide policy on remote work. All employees must register their primary work location.",
    "Internal report on Project Titan's supply chain logistics. Notes delays from vendor XYZ.",
    "Performance review for John Doe. Excellent feedback from his team.",
    "A document outlining the intellectual property agreement for Project Chimera. The patent filing is scheduled for next month.",
    "Safety audit report for the main manufacturing facility. No major issues found.",
    "Draft press release announcing the Innovate Inc. merger. For internal review only.",
    "Chat logs from the engineering team. Discussion about fixing a minor bug in the user interface."
];

export const generateMockDocuments = (count: number): Document[] => {
    const documents: Document[] = [];
    for (let i = 1; i <= count; i++) {
        documents.push({
            id: `ABC.0001.001.${pad(i, 4)}`,
            name: `document_${pad(i, 4)}.txt`,
            content: MOCK_CONTENT[i % MOCK_CONTENT.length] + ` (This is content for document ${i}).`,
        });
    }
    return documents;
};

const extractTextFromTxt = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target?.result as string);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
};

const extractTextFromPdf = async (file: File): Promise<string> => {
    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
        throw new Error('pdf.js library is not loaded.');
    }
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map((item: any) => item.str).join(' ');
        textContent += '\n';
    }
    return textContent;
};

const extractTextFromDocx = async (file: File): Promise<string> => {
    const mammoth = (window as any).mammoth;
    if (!mammoth) {
        throw new Error('mammoth.js library is not loaded.');
    }
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

export const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'text/plain') {
        return extractTextFromTxt(file);
    }
    if (file.type === 'application/pdf') {
        return extractTextFromPdf(file);
    }
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        return extractTextFromDocx(file);
    }
    throw new Error(`Unsupported file type: ${file.type || file.name}`);
};
