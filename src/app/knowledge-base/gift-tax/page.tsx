"use client";

import { useState } from "react";
import { giftTaxChapters, importantSections, allSectionsFlat } from "@/lib/data/gift-tax";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, Book, Download, Search, ChevronDown, ChevronRight, BookOpen, Clock, Layers, FileText, File as FileIcon, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function GiftTaxKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredSections = allSectionsFlat.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sec.number.includes(searchQuery)
  );

  const paginatedSections = filteredSections.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredSections.length / itemsPerPage);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      {/* Breadcrumbs */}
      <div className="bg-background border-b px-4 py-3 md:px-8 flex items-center text-sm text-muted-foreground space-x-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/knowledge-base" className="hover:text-primary transition-colors">Knowledge Base</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Gift-tax Act, 1958</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <Card className="shadow-sm border-primary/10">
              <CardHeader className="bg-primary/5 pb-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  On This Page
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col text-sm">
                  <button onClick={() => scrollToSection("overview")} className="text-left px-4 py-3 hover:bg-muted/50 border-b font-medium text-foreground transition-colors">Overview</button>
                  <button onClick={() => scrollToSection("important")} className="text-left px-4 py-3 hover:bg-muted/50 border-b font-medium text-foreground transition-colors">Important Sections</button>
                  <button onClick={() => scrollToSection("index")} className="text-left px-4 py-3 hover:bg-muted/50 border-b font-medium text-foreground transition-colors">Searchable Index</button>
                  <button onClick={() => scrollToSection("reference")} className="text-left px-4 py-3 hover:bg-muted/50 border-b font-medium text-foreground transition-colors">Full Act Reference</button>
                  <button onClick={() => scrollToSection("download")} className="text-left px-4 py-3 hover:bg-muted/50 font-medium text-foreground transition-colors">Official Document</button>
                </div>
              </CardContent>
            </Card>

            {/* Download Card */}
            <Card className="bg-primary text-primary-foreground shadow-md" id="download">
              <CardHeader>
                <CardTitle className="text-lg">Official Document</CardTitle>
                <CardDescription className="text-primary-foreground/80">Download the full historical PDF of the Gift-tax Act, 1958.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-white text-primary hover:bg-gray-100 gap-2 font-semibold">
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
                <p className="text-xs text-center mt-3 text-primary-foreground/70">Size: 2.4 MB • Format: PDF</p>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-3 space-y-10">
          
          {/* Hero Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Historical Reference</Badge>
              <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">Taxation</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Gift-tax Act, 1958</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              A comprehensive reference guide to the historical Gift-tax Act of India, outlining the charge of gift-tax, exemptions, valuation methods, and authorities.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5 mt-6 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900">Abolition of Gift Tax</h3>
                <p className="text-amber-800/90 text-sm mt-1 leading-relaxed">
                  The Gift-tax Act ceased to apply and has no effect whatsoever in respect of any gift made on or after the <strong>1st day of October, 1998</strong>. Currently, gifts are generally governed and taxed under the provisions of the Income-tax Act, 1961 (specifically under Income from Other Sources). This page serves as a historical legal reference.
                </p>
              </div>
            </div>
          </section>

          {/* Quick Overview */}
          <section id="overview" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2">Quick Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <Book className="w-6 h-6 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Act Name</p>
                  <p className="font-semibold text-foreground mt-1">Act No. 18</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <Clock className="w-6 h-6 text-emerald-600 mb-2" />
                  <p className="text-sm text-muted-foreground">Enacted On</p>
                  <p className="font-semibold text-foreground mt-1">15 May 1958</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <Layers className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-sm text-muted-foreground">Structure</p>
                  <p className="font-semibold text-foreground mt-1">8 Chapters</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                  <FileText className="w-6 h-6 text-purple-600 mb-2" />
                  <p className="text-sm text-muted-foreground">Volume</p>
                  <p className="font-semibold text-foreground mt-1">47 Sections</p>
                </CardContent>
              </Card>
            </div>
            <div className="bg-card border rounded-xl p-6 shadow-sm mt-4 text-muted-foreground leading-relaxed text-sm md:text-base">
              The Gift-tax Act, 1958 was enacted by the Parliament in the Ninth Year of the Republic of India to provide for the levy of gift-tax. It extended to the whole of India and came into force on the 1st day of April, 1958. It detailed the definitions of gifts, the chargeability of the tax, the process of valuation, exemptions, and the administrative authorities responsible for assessment and recovery.
            </div>
          </section>

          {/* Important Sections */}
          <section id="important" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-bold border-b pb-2">Key Sections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {importantSections.map((sec) => (
                <Card key={sec.id} className="shadow-sm hover:shadow-md transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Section {sec.number}</Badge>
                      <button onClick={() => scrollToSection(sec.id)} className="text-muted-foreground hover:text-primary transition-colors p-1" title="Jump to section text">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                    <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">{sec.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {sec.summary}
                    </p>
                    <Button variant="outline" size="sm" className="w-full font-medium" onClick={() => scrollToSection(sec.id)}>
                      View Full Text <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Searchable Index */}
          <section id="index" className="scroll-mt-24 space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold">Section Index</h2>
                <p className="text-muted-foreground text-sm mt-1">Quickly locate and navigate to specific sections.</p>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sections or titles..."
                  className="pl-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-24">Section</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="w-32">Chapter</TableHead>
                    <TableHead className="text-right w-24">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSections.length > 0 ? (
                    paginatedSections.map((sec) => (
                      <TableRow key={`index-${sec.id}`}>
                        <TableCell className="font-semibold text-primary">{sec.number}</TableCell>
                        <TableCell className="font-medium">{sec.title}</TableCell>
                        <TableCell>Chapter {sec.chapter}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 hover:bg-primary/10 hover:text-primary" onClick={() => scrollToSection(sec.id)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No sections found matching "{searchQuery}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSections.length)} of {filteredSections.length}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Full Act Reference */}
          <section id="reference" className="scroll-mt-24 space-y-6 pt-4">
            <h2 className="text-2xl font-bold border-b pb-2">Full Act Reference</h2>
            <div className="space-y-4">
              {giftTaxChapters.map((chapter) => (
                <Collapsible key={chapter.id} className="bg-card border rounded-xl shadow-sm overflow-hidden group/chapter">
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between bg-muted/10 hover:bg-muted/30 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                        {chapter.number}
                      </div>
                      <h3 className="font-semibold text-lg">{chapter.title}</h3>
                    </div>
                    <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform group-data-[state=open]/chapter:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 py-2 bg-background border-t">
                    <div className="space-y-1 my-2">
                      {chapter.sections.map((sec) => (
                        <Collapsible key={sec.id} className="group/section border-b last:border-b-0">
                          <CollapsibleTrigger id={sec.id} className="w-full py-4 flex gap-3 text-left hover:text-primary transition-colors scroll-mt-28">
                            <FileIcon className="w-4 h-4 text-muted-foreground mt-1 shrink-0 group-hover/section:text-primary" />
                            <div className="flex-1">
                              <span className="font-semibold mr-2">Section {sec.number}.</span>
                              <span className="font-medium text-muted-foreground group-hover/section:text-primary transition-colors">{sec.title}</span>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pb-4 pl-7">
                            <div className="text-muted-foreground leading-relaxed text-sm bg-muted/10 p-4 rounded-lg border">
                              {sec.content}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </section>

          {/* Related Articles */}
          <section className="pt-8 space-y-4">
            <h2 className="text-xl font-bold">Related Knowledge Base</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link href="/knowledge-base/income-tax-act" className="block">
                <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base text-primary">Income Tax Act, 1961</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">Current regulations governing the taxation of gifts under 'Income from Other Sources'.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/knowledge-base/capital-gains" className="block">
                <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base text-primary">Capital Gains Tax</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">Understanding the tax implications of transferring property and capital assets.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/knowledge-base/stamp-duty" className="block">
                <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base text-primary">Stamp Duty</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">State-wise stamp duty requirements for the execution of gift deeds.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
