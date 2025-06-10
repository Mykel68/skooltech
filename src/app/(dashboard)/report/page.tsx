'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function ReportTemplateBuilder() {
	const [template, setTemplate] = useState({
		schoolName: '',
		logoUrl: '',
		showStudentInfo: true,
		showTermSession: true,
		showAttendance: true,
		showSubject: true,
		showScore: true,
		showGrade: true,
		showRemark: true,
		showAverage: true,
		showPosition: true,
		teacherRemark: true,
		footerText: '',
	});

	const handleChange = (key, value) => {
		setTemplate({ ...template, [key]: value });
	};

	const handleSave = () => {
		console.log('Saved template:', template);
		// API call to save template here
	};

	return (
		<div className='max-w-4xl mx-auto space-y-6 p-4'>
			<h1 className='text-2xl font-semibold'>
				🧾 Report Template Designer
			</h1>

			<Card>
				<CardContent className='grid gap-4 p-4'>
					<Label>School Name</Label>
					<Input
						value={template.schoolName}
						onChange={(e) =>
							handleChange('schoolName', e.target.value)
						}
					/>

					<Label>Logo URL</Label>
					<Input
						value={template.logoUrl}
						onChange={(e) =>
							handleChange('logoUrl', e.target.value)
						}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardContent className='grid gap-4 p-4'>
					<div className='flex items-center justify-between'>
						<Label>Show Student Info</Label>
						<Switch
							checked={template.showStudentInfo}
							onCheckedChange={(val) =>
								handleChange('showStudentInfo', val)
							}
						/>
					</div>

					<div className='flex items-center justify-between'>
						<Label>Show Term/Session</Label>
						<Switch
							checked={template.showTermSession}
							onCheckedChange={(val) =>
								handleChange('showTermSession', val)
							}
						/>
					</div>

					<div className='flex items-center justify-between'>
						<Label>Show Attendance</Label>
						<Switch
							checked={template.showAttendance}
							onCheckedChange={(val) =>
								handleChange('showAttendance', val)
							}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className='grid gap-4 p-4'>
					<h2 className='font-semibold text-lg'>Subjects Table</h2>
					<div className='grid grid-cols-2 gap-2'>
						<Label className='flex items-center gap-2'>
							<Switch
								checked={template.showSubject}
								onCheckedChange={(val) =>
									handleChange('showSubject', val)
								}
							/>
							Subject
						</Label>
						<Label className='flex items-center gap-2'>
							<Switch
								checked={template.showScore}
								onCheckedChange={(val) =>
									handleChange('showScore', val)
								}
							/>
							Score
						</Label>
						<Label className='flex items-center gap-2'>
							<Switch
								checked={template.showGrade}
								onCheckedChange={(val) =>
									handleChange('showGrade', val)
								}
							/>
							Grade
						</Label>
						<Label className='flex items-center gap-2'>
							<Switch
								checked={template.showRemark}
								onCheckedChange={(val) =>
									handleChange('showRemark', val)
								}
							/>
							Remark
						</Label>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className='grid gap-4 p-4'>
					<div className='flex items-center justify-between'>
						<Label>Show Average</Label>
						<Switch
							checked={template.showAverage}
							onCheckedChange={(val) =>
								handleChange('showAverage', val)
							}
						/>
					</div>

					<div className='flex items-center justify-between'>
						<Label>Show Position</Label>
						<Switch
							checked={template.showPosition}
							onCheckedChange={(val) =>
								handleChange('showPosition', val)
							}
						/>
					</div>

					<div className='flex items-center justify-between'>
						<Label>Teacher Remark</Label>
						<Switch
							checked={template.teacherRemark}
							onCheckedChange={(val) =>
								handleChange('teacherRemark', val)
							}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className='grid gap-4 p-4'>
					<Label>Footer Text</Label>
					<Textarea
						rows={3}
						value={template.footerText}
						onChange={(e) =>
							handleChange('footerText', e.target.value)
						}
					/>
				</CardContent>
			</Card>

			<div className='flex justify-end'>
				<Button onClick={handleSave}>💾 Save Template</Button>
			</div>
		</div>
	);
}
