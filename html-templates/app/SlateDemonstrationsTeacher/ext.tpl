{extends app/slate-ext.tpl}

{block meta}
    {capture assign=title}Demonstrations Teacher Dashboard &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}

{block js-data}
    {$dwoo.parent}

    {literal}
        <!-- TODO: eliminate need for this test data -->
        <script type="text/javascript">
            var SiteEnvironment = SiteEnvironment || { };
            SiteEnvironment.user = {"ID":1,"Class":"Emergence\\People\\User","Created":1405633320,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"FirstName":"Chris","LastName":"Alfano","MiddleName":null,"Gender":null,"BirthDate":null,"Location":null,"About":null,"PrimaryPhotoID":null,"PrimaryEmailID":5,"PrimaryPhoneID":null,"PrimaryPostalID":7,"Username":"chris","AccountLevel":"Developer","AssignedPassword":null};
            SiteEnvironment.cblStudents = [{"ID":26,"FirstName":"Marcos","LastName":"Maclennan","Username":"mmaclennan"},{"ID":15,"FirstName":"Jacalyn","LastName":"Jawad","Username":"jjawad"},{"ID":14,"FirstName":"Williemae","LastName":"Walko","Username":"wwalko"},{"ID":13,"FirstName":"Dania","LastName":"Decoteau","Username":"ddecoteau"},{"ID":12,"FirstName":"Carmelo","LastName":"Crossley","Username":"ccrossley"},{"ID":11,"FirstName":"Rena","LastName":"Riddick","Username":"rriddick"},{"ID":10,"FirstName":"Nada","LastName":"Neher","Username":"nneher"},{"ID":9,"FirstName":"Jimmy","LastName":"Jaquith","Username":"jjaquith"},{"ID":8,"FirstName":"Tomika","LastName":"Truett","Username":"ttruett"},{"ID":16,"FirstName":"Yung","LastName":"Yingst","Username":"yyingst"},{"ID":17,"FirstName":"Nelle","LastName":"Northern","Username":"nnorthern"},{"ID":25,"FirstName":"Mika","LastName":"Minyard","Username":"mminyard"},{"ID":24,"FirstName":"Donella","LastName":"Dunlop","Username":"ddunlop"},{"ID":23,"FirstName":"Alfonso","LastName":"Agudelo","Username":"aagudelo"},{"ID":22,"FirstName":"Berta","LastName":"Bou","Username":"bbou"},{"ID":21,"FirstName":"Valeria","LastName":"Velazco","Username":"vvelazco"},{"ID":20,"FirstName":"Deedra","LastName":"Debose","Username":"ddebose"},{"ID":19,"FirstName":"Melodee","LastName":"Mcadams","Username":"mmcadams"},{"ID":18,"FirstName":"Darcel","LastName":"Dobos","Username":"ddobos"},{"ID":7,"FirstName":"Glennie","LastName":"Gattison","Username":"ggattison"}];
            SiteEnvironment.cblContentArea = {"ID":1,"Class":"Slate\\CBL\\ContentArea","Created":1412476110,"CreatorID":1,"Code":"ELA","Title":"ELA"};
            SiteEnvironment.cblCompetencies = [{"ID":1,"Class":"Slate\\CBL\\Competency","Created":1412476110,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.1","Descriptor":"Reading Literature","Statement":"Read and comprehend appropriately complex literary texts independently and proficiently.","totalDemonstrationsRequired":27,"minimumAverageOffset":-0.5},{"ID":2,"Class":"Slate\\CBL\\Competency","Created":1412476110,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.2","Descriptor":"Reading Informational Texts","Statement":"Read and comprehend appropriately complex informational texts independently and proficiently.","totalDemonstrationsRequired":30,"minimumAverageOffset":-0.5},{"ID":3,"Class":"Slate\\CBL\\Competency","Created":1412476110,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.3","Descriptor":"Writing Evidence-based Arguments","Statement":"Write evidence-based arguments to support claims in an analysis of substantive topics or texts using valid reasoning and relevant and sufficient evidence.","totalDemonstrationsRequired":24,"minimumAverageOffset":-0.5},{"ID":4,"Class":"Slate\\CBL\\Competency","Created":1412476110,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.4","Descriptor":"Writing Informative Texts","Statement":"Write informative\/explanatory texts to examine and convey complex ideas and information clearly and accurately through the effective selection, organization, and analysis of content.","totalDemonstrationsRequired":27,"minimumAverageOffset":-0.5},{"ID":5,"Class":"Slate\\CBL\\Competency","Created":1412476111,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.5","Descriptor":"Writing Narrative Texts","Statement":"Write narratives to develop real or imagined experiences or events using effective technique, well-chosen details and well-structured event sequences.","totalDemonstrationsRequired":16,"minimumAverageOffset":-0.5},{"ID":6,"Class":"Slate\\CBL\\Competency","Created":1412476111,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.6","Descriptor":"Collaborative Discussions","Statement":"Initiate and participate in collaborative discussions, listen critically, and respond appropriately as individuals or in a group setting.","totalDemonstrationsRequired":24,"minimumAverageOffset":-0.5},{"ID":7,"Class":"Slate\\CBL\\Competency","Created":1412476111,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.7","Descriptor":"Giving Presentations","Statement":"Give effective presentations in formal settings, making purposeful decisions about content, language use, and discourse style based on the audience, venue, and topic.","totalDemonstrationsRequired":21,"minimumAverageOffset":-0.5},{"ID":8,"Class":"Slate\\CBL\\Competency","Created":1412476111,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.8","Descriptor":"Conducting Research","Statement":"Frame and advance an inquiry to investigate topics, build knowledge, and analyze and integrate information.","totalDemonstrationsRequired":14,"minimumAverageOffset":-0.5}];
    
            SiteEnvironment.cblExperienceTypeOptions = ["Core Studio","Choice Studio","Workshop","Health and Wellness","PE\/Fitness","Online Courseware","Situated Learning","Work-based Learning","Advisory"];
            SiteEnvironment.cblContextOptions = ["Journalism","Mythbusters","Personal Finance","Math Workshop","Literacy Workshop","Culinary Arts","Entrepreneurship","Performing Arts","Help Desk"];
            SiteEnvironment.cblPerformanceTypeOptions = ["Position paper","Lab report","Media presentation","Argumentative essay","Speech"];
        </script>
    {/literal}
{/block}

{block body}
    {$dwoo.parent}

    <div class="wrapper site">
        <main class="content site" role="main">
            <div id="slateapp-viewport" class="inner">
                <!-- app renders here -->
            </div>
        </main>
    </div>
{/block}