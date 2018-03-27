{capture assign=subject}[SLATE TASK UPDATE] {$CourseName}: {$Title}{/capture}
{$from = $Sender->EmailRecipient}
<html>
    <body>
        {if $message}
            {$message|markdown}
        {/if}
        <p>Assignment: {$Title}</p>
        <p>Teacher: {$TeacherName}</p>
        <p>Class: {$CourseName} </p>
        <p>Due: {date_format($DueDate)}</p>
        <p>{$Description}</p>
        <p>
    </body>
</html>