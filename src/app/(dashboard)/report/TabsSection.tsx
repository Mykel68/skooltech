'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Settings } from 'lucide-react';
import SchoolInformationTab from './SchoolTab';
import StudentReports from './StudentReport';

const TabsSection = ({
	activeTab,
	setActiveTab,
	students,
	studentsLoading,
	schoolInfo,
	schoolLoading,
	email,
	schoolId,
	handleViewReport,
	generateReportPending,
}) => {
	return (
		<Tabs
			value={activeTab}
			onValueChange={setActiveTab}
			className='w-full space-y-6'
		>
			<TabsList className='w-full grid grid-cols-2 gap-2 bg-muted p-1 rounded-lg shadow-sm'>
				<TabsTrigger
					value='reports'
					className='flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-white data-[state=active]:text-foreground shadow-sm'
				>
					<FileText className='w-4 h-4' />
					Student Reports
				</TabsTrigger>
				<TabsTrigger
					value='admin'
					className='flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-white data-[state=active]:text-foreground shadow-sm'
				>
					<Settings className='w-4 h-4' />
					School Settings
				</TabsTrigger>
			</TabsList>

			<TabsContent value='reports'>
				<StudentReports
					students={students}
					studentsLoading={studentsLoading}
					schoolInfo={schoolInfo}
					schoolLoading={schoolLoading}
					handleViewReport={handleViewReport}
					generateReportPending={generateReportPending}
				/>
			</TabsContent>

			<TabsContent value='admin'>
				<SchoolInformationTab
					schoolInfo={schoolInfo}
					schoolId={schoolId}
					email={email}
				/>
			</TabsContent>
		</Tabs>
	);
};

export default TabsSection;
