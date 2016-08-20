{extends app/slate-ext.tpl}

{block meta}
    {capture assign=title}Demonstrations Student Dashboard &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}

{block css-loader}
    {$dwoo.parent}
    {$slateAppFullWidth = false}
{/block}

{block js-data}
    {$dwoo.parent}

    {literal}
        <!-- TODO: eliminate need for this test data -->
        <script type="text/javascript">
            var SiteEnvironment = SiteEnvironment || { };
            SiteEnvironment.user = {"ID":1,"Class":"Emergence\\People\\User","Created":1405633320,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"FirstName":"Chris","LastName":"Alfano","MiddleName":null,"Gender":null,"BirthDate":null,"Location":null,"About":null,"PrimaryPhotoID":null,"PrimaryEmailID":5,"PrimaryPhoneID":null,"PrimaryPostalID":7,"Username":"chris","AccountLevel":"Developer","AssignedPassword":null};
            SiteEnvironment.cblStudent = {"ID":22,"FirstName":"Berta","LastName":"Bou","Username":"bbou"};
            SiteEnvironment.cblContentArea = {"ID":1,"Class":"Slate\\CBL\\ContentArea","Created":1412476110,"CreatorID":1,"Code":"ELA","Title":"ELA"};
            SiteEnvironment.cblCompetencies = [{"ID":1,"Class":"Slate\\CBL\\Competency","Created":1412476110,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.1","Descriptor":"Reading Literature","Statement":"Read and comprehend appropriately complex literary texts independently and proficiently.","totalDemonstrationsRequired":27,"minimumAverageOffset":-0.5},{"ID":2,"Class":"Slate\\CBL\\Competency","Created":1412476110,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.2","Descriptor":"Reading Informational Texts","Statement":"Read and comprehend appropriately complex informational texts independently and proficiently.","totalDemonstrationsRequired":30,"minimumAverageOffset":-0.5},{"ID":3,"Class":"Slate\\CBL\\Competency","Created":1412476110,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.3","Descriptor":"Writing Evidence-based Arguments","Statement":"Write evidence-based arguments to support claims in an analysis of substantive topics or texts using valid reasoning and relevant and sufficient evidence.","totalDemonstrationsRequired":24,"minimumAverageOffset":-0.5},{"ID":4,"Class":"Slate\\CBL\\Competency","Created":1412476110,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.4","Descriptor":"Writing Informative Texts","Statement":"Write informative\/explanatory texts to examine and convey complex ideas and information clearly and accurately through the effective selection, organization, and analysis of content.","totalDemonstrationsRequired":27,"minimumAverageOffset":-0.5},{"ID":5,"Class":"Slate\\CBL\\Competency","Created":1412476111,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.5","Descriptor":"Writing Narrative Texts","Statement":"Write narratives to develop real or imagined experiences or events using effective technique, well-chosen details and well-structured event sequences.","totalDemonstrationsRequired":16,"minimumAverageOffset":-0.5},{"ID":6,"Class":"Slate\\CBL\\Competency","Created":1412476111,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.6","Descriptor":"Collaborative Discussions","Statement":"Initiate and participate in collaborative discussions, listen critically, and respond appropriately as individuals or in a group setting.","totalDemonstrationsRequired":24,"minimumAverageOffset":-0.5},{"ID":7,"Class":"Slate\\CBL\\Competency","Created":1412476111,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.7","Descriptor":"Giving Presentations","Statement":"Give effective presentations in formal settings, making purposeful decisions about content, language use, and discourse style based on the audience, venue, and topic.","totalDemonstrationsRequired":21,"minimumAverageOffset":-0.5},{"ID":8,"Class":"Slate\\CBL\\Competency","Created":1412476111,"CreatorID":1,"RevisionID":null,"Modified":null,"ModifierID":null,"ContentAreaID":1,"Code":"ELA.8","Descriptor":"Conducting Research","Statement":"Frame and advance an inquiry to investigate topics, build knowledge, and analyze and integrate information.","totalDemonstrationsRequired":14,"minimumAverageOffset":-0.5}];
        </script>
    {/literal}
{/block}