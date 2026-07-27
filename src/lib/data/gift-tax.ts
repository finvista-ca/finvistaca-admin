export interface Section {
  id: string;
  number: string;
  title: string;
  chapter: string;
  content: string;
}

export interface Chapter {
  id: string;
  number: string;
  title: string;
  sections: Section[];
}

export interface ImportantSection {
  id: string;
  number: string;
  title: string;
  summary: string;
}

export const giftTaxChapters: Chapter[] = [
  {
    id: "chapter-1",
    number: "I",
    title: "PRELIMINARY",
    sections: [
      { id: "section-1", number: "1", title: "Short title, extent and commencement.", chapter: "I", content: "This Act may be called the Gift-tax Act, 1958. It extends to the whole of India except the State of Jammu and Kashmir. It shall be deemed to have come into force on the 1st day of April, 1958." },
      { id: "section-2", number: "2", title: "Definitions.", chapter: "I", content: "In this Act, unless the context otherwise requires, 'Appellate Tribunal' means the Appellate Tribunal constituted under section 252 of the Income-tax Act; 'assessee' means a person by whom gift-tax or any other sum of money is payable under this Act, and includes every person in respect of whom any proceeding under this Act has been taken for the determination of gift-tax payable by him or by any other person or the amount of refund due to him or such other person; every person who is deemed to be an assessee under this Act; every person who is deemed to be an assessee in default under this Act; 'Assessing Officer' means the Assistant Commissioner or Deputy Commissioner or the Income-tax Officer who is vested with the relevant jurisdiction... 'gift' means the transfer by one person to another of any existing movable or immovable property made voluntarily and without consideration in money or money's worth..." }
    ]
  },
  {
    id: "chapter-2",
    number: "II",
    title: "CHARGE OF GIFT-TAX AND GIFTS SUBJECT TO SUCH CHARGE",
    sections: [
      { id: "section-3", number: "3", title: "Charge of gift-tax.", chapter: "II", content: "Subject to the other provisions contained in this Act, there shall be charged for every assessment year commencing on and from the 1st day of April, 1958, but before the 1st day of April, 1987, a tax (hereinafter referred to as gift-tax) in respect of the gifts, if any, made by a person during the previous year (other than gifts made before the 1st day of April, 1957), at the rate or rates specified in Schedule I. Notwithstanding anything contained in sub-section (2), the provisions of this Act shall cease to apply and shall have no effect whatsoever in respect of any gift made on or after the 1st day of October, 1998." },
      { id: "section-4", number: "4", title: "Gifts to include certain transfers.", chapter: "II", content: "For the purposes of this Act, where property is transferred otherwise than for adequate consideration, the amount by which the value of the property as on the date of the transfer and determined in the manner laid down in Schedule II, exceeds the value of the consideration shall be deemed to be a gift made by the transferor..." },
      { id: "section-5", number: "5", title: "Exemption in respect of certain gifts.", chapter: "II", content: "Gift-tax shall not be charged under this Act in respect of gifts made by any person of immovable property situate outside the territories to which this Act extends; of movable property situate outside the said territories unless the person being an individual, is a citizen of India and is ordinarily resident in the said territories, or not being an individual, is resident in the said territories, during the previous year in which the gift is made..." },
      { id: "section-6", number: "6", title: "Value of gifts, how determined.", chapter: "II", content: "Subject to the provisions of sub-section (2), the value of any property, other than cash, transferred by way of gift shall, for the purpose of this Act, be its value as on the date on which the gift was made and shall be determined in the manner laid down in Schedule II. Where a person makes a gift which is not revocable for a specified period, the value of the property gifted shall be the capitalised value of the income from such property during the period for which the gift is not revocable." }
    ]
  },
  {
    id: "chapter-3",
    number: "III",
    title: "GIFT-TAX AUTHORITIES",
    sections: [
      { id: "section-7", number: "7", title: "Gift-tax authorities and their jurisdiction.", chapter: "III", content: "The income-tax authorities specified in section 116 of the Income-tax Act shall be the gift-tax authorities for the purposes of this Act and every such authority shall exercise the powers and perform the functions of a gift-tax authority under this Act in respect of any person within his jurisdiction..." },
      { id: "section-8", number: "8", title: "Control of gift-tax authorities.", chapter: "III", content: "Section 118 of the Income-tax Act and any notification issued thereunder shall apply in relation to the control of gift-tax authorities as they apply in relation to the control of the corresponding income-tax authorities..." },
      { id: "section-9", number: "9", title: "Instructions to subordinate authorities.", chapter: "III", content: "The Board may, from time to time, issue such orders, instructions and directions to other gift-tax authorities as it may deem fit for the proper administration of this Act..." },
      { id: "section-10", number: "10", title: "Jurisdiction of Assessing Officers and power to transfer cases.", chapter: "III", content: "The provisions of sections 124 and 127 of the Income-tax Act shall, so far as may be, apply for the purposes of this Act as they apply for the purposes of the Income-tax Act..." },
      { id: "section-12a", number: "12A", title: "Power of Chief Commissioner or Commissioner and of Joint Commissioner to make enquiries under this Act.", chapter: "III", content: "The Chief Commissioner or Commissioner and the Joint Commissioner shall be competent to make any enquiry under this Act, and for this purpose, shall have all the powers that an Assessing Officer has under this Act in relation to the making of enquiries." }
    ]
  },
  {
    id: "chapter-4",
    number: "IV",
    title: "ASSESSMENT",
    sections: [
      { id: "section-13", number: "13", title: "Return of gifts.", chapter: "IV", content: "Every person who during a previous year has made any taxable gifts, or is assessable in respect of the taxable gifts made by any other person under this Act... shall, on or before the 30th day of June of the corresponding assessment year, furnish a return of such gifts..." },
      { id: "section-14", number: "14", title: "Return after due date and amendment of return.", chapter: "IV", content: "If any person has not furnished a return within the time allowed... he may furnish a return or a revised return, as the case may be, at any time before the expiry of one year from the end of the relevant assessment year..." },
      { id: "section-15", number: "15", title: "Assessment.", chapter: "IV", content: "Where a return has been made under section 13 or section 14 or in response to a notice... if any tax or interest is found due on the basis of such return after adjustment of any amount paid by way of tax or interest, an intimation shall be sent to the assessee specifying the sum so payable..." },
      { id: "section-16", number: "16", title: "Gift escaping assessment.", chapter: "IV", content: "If the Assessing Officer has reasons to believe that the taxable gifts in respect of which any person is assessable under this Act... have escaped assessment for any assessment year... he may serve on such person a notice requiring him to furnish... a return in the prescribed form..." },
      { id: "section-17", number: "17", title: "Penalty for failure to furnish returns, to comply with notices and concealment of gifts, etc.", chapter: "IV", content: "If the Assessing Officer, Deputy Commissioner (Appeals), Commissioner (Appeals), Chief Commissioner or Commissioner or Appellate Tribunal, in the course of any proceedings under this Act, is satisfied that any person has failed to comply with a notice... or has concealed the particulars of any gift... he or it may, by order in writing, direct that such person shall pay by way of penalty..." }
    ]
  },
  {
    id: "chapter-5",
    number: "V",
    title: "LIABILITY TO ASSESSMENT IN SPECIAL CASES",
    sections: [
      { id: "section-19", number: "19", title: "Tax of deceased person payable by legal representative.", chapter: "V", content: "Where a person dies, his executor, administrator or other legal representative shall be liable to pay out of the estate of the deceased person, to the extent to which the estate is capable of meeting the charge, the gift-tax determined as payable by such person..." },
      { id: "section-20", number: "20", title: "Assessment after partition of a Hindu undivided family.", chapter: "V", content: "Where, at the time of making an assessment, it is brought to the notice of the Assessing Officer that a partition has taken place among the members of a Hindu undivided family... he shall record an order to that effect and he shall make assessments on the value of the taxable gifts made by the family as such as if no partition had taken place..." }
    ]
  },
  {
    id: "chapter-6",
    number: "VI",
    title: "APPEALS, REVISIONS AND REFERENCES",
    sections: [
      { id: "section-22", number: "22", title: "Appeal to the Deputy Commissioner (Appeals) from orders of Assessing Officer.", chapter: "VI", content: "Subject to the provisions of sub-section (1A), any person objecting to the value of taxable gifts determined under this Act; or objecting to the amount of gift-tax determined as payable by him under this Act; or denying his liability to be assessed under this Act... may appeal to the Deputy Commissioner (Appeals) against the assessment or order..." },
      { id: "section-23", number: "23", title: "Appeal to the Appellate Tribunal.", chapter: "VI", content: "An assessee, objecting to an order passed by the Deputy Commissioner (Appeals) or the Commissioner (Appeals)... may appeal to the Appellate Tribunal within sixty days of the date on which the order is communicated to him." },
      { id: "section-24", number: "24", title: "Powers of Commissioner to revise orders of subordinate authorities.", chapter: "VI", content: "The Commissioner may, either on his own motion or on application made by an assessee in this behalf, call for the record of any proceeding under this Act in which an order has been passed by any authority subordinate to him, and may make such inquiry... and pass such order thereon, not being an order prejudicial to the assessee, as the Commissioner thinks fit..." },
      { id: "section-26", number: "26", title: "Reference to High Court.", chapter: "VI", content: "The assessee or the Chief Commissioner or Commissioner may, within sixty days of the date upon which he is served with notice of an order under section 23... by application in the prescribed form... require the Appellate Tribunal to refer to the High Court any question of law arising out of such order..." },
      { id: "section-28", number: "28", title: "Appeal to Supreme Court.", chapter: "VI", content: "An appeal shall lie to the Supreme Court from any judgment of the High Court delivered on a case stated under section 26 in any case which the High Court certifies as a fit case for appeal to the Supreme Court." }
    ]
  },
  {
    id: "chapter-7",
    number: "VII",
    title: "PAYMENT AND RECOVERY OF GIFT-TAX",
    sections: [
      { id: "section-29", number: "29", title: "Gift-tax by whom payable.", chapter: "VII", content: "Subject to the provisions of this Act, gift-tax shall be payable by the donor but when in the opinion of the Assessing Officer the tax cannot be recovered from the donor, it may be recovered from the donee..." },
      { id: "section-30", number: "30", title: "Gift-tax to be charged on property gifted.", chapter: "VII", content: "Gift-tax payable in respect of any gift comprising immovable property shall be a first charge on that property but any such charge shall not affect the title of a bona fide purchaser for valuable consideration without notice of the charge." },
      { id: "section-31", number: "31", title: "Notice of demand.", chapter: "VII", content: "When any tax, interest, penalty, fine or any other sum is payable in consequence of any order passed under this Act, the Assessing Officer shall serve upon the assessee a notice of demand in the prescribed form specifying the sum so payable." },
      { id: "section-32", number: "32", title: "Recovery of tax and penalties.", chapter: "VII", content: "Any amount specified as payable in a notice of demand under section 31 shall be paid within thirty days of the service of the notice at the place and to the person mentioned in the notice..." }
    ]
  },
  {
    id: "chapter-7a",
    number: "VIIA",
    title: "REFUNDS",
    sections: [
      { id: "section-33a", number: "33A", title: "Refunds.", chapter: "VIIA", content: "Where, as a result of any order passed in appeal or other proceeding under this Act, refund of any amount becomes due to the assessee, the Assessing Officer shall, except as otherwise provided in this Act, refund the amount to the assessee without his having to make any claim in that behalf..." }
    ]
  },
  {
    id: "chapter-8",
    number: "VIII",
    title: "MISCELLANEOUS",
    sections: [
      { id: "section-34", number: "34", title: "Rectification of mistakes.", chapter: "VIII", content: "With a view to rectifying any mistake apparent from the record the Assessing Officer may amend any order of assessment or of refund or any other order passed by him; a gift-tax authority may amend any intimation sent by it..." },
      { id: "section-35", number: "35", title: "Prosecution.", chapter: "VIII", content: "If any person fails without reasonable cause to furnish in due time any return of gifts under this Act; to produce, or cause to be produced, on or before the date mentioned in any notice... he shall, on conviction before a magistrate, be punishable with fine which may extend to rupees ten for every day during which the default continues." },
      { id: "section-42", number: "42", title: "Bar of suits in civil court.", chapter: "VIII", content: "No suit shall lie in any civil court to set aside or modify any proceeding taken or order made under this Act, and no prosecution, suit or other legal proceedings shall lie against the Government or any officer of the Government for anything in good faith done or intended to be done under this Act." },
      { id: "section-46", number: "46", title: "Power to make rules.", chapter: "VIII", content: "The Board may, by notification in the Official Gazette, make rules for carrying out the purposes of this Act..." },
      { id: "section-47", number: "47", title: "Power to remove difficulties.", chapter: "VIII", content: "If any difficulty arises in giving effect to the provisions of this Act as amended by the Direct Tax Laws (Amendment) Act, 1987 (4 of 1988), the Central Government may, by order, do anything not inconsistent with such provisions for the purpose of removing the difficulty..." }
    ]
  }
];

export const importantSections: ImportantSection[] = [
  {
    id: "section-3",
    number: "3",
    title: "Charge of gift-tax",
    summary: "Outlines the primary charge of gift-tax for assessment years starting from April 1, 1958, and confirms the abolition of the Act for gifts made on or after October 1, 1998."
  },
  {
    id: "section-4",
    number: "4",
    title: "Gifts to include certain transfers",
    summary: "Specifies that transfers of property for inadequate consideration, release of debts, or vesting property jointly without adequate consideration are deemed as taxable gifts."
  },
  {
    id: "section-5",
    number: "5",
    title: "Exemption in respect of certain gifts",
    summary: "Provides an extensive list of exemptions including gifts of property situated outside India, gifts to the Government or local authorities, and gifts for charitable purposes."
  },
  {
    id: "section-6",
    number: "6",
    title: "Value of gifts, how determined",
    summary: "Mandates that the value of any non-cash property transferred by way of gift shall be its value on the date the gift was made, determined according to Schedule II."
  }
];

export const allSectionsFlat = giftTaxChapters.flatMap(chapter => chapter.sections);
