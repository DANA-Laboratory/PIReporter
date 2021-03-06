const config = require('config');
const insertvalidverbs = {
  addUser: ['tblUser', ['account', 'password', 'fname', 'lname', 'pcode', 'workunit', 'sysadmin', 'github', 'telegram'], ['attribute']],
  addReportClass: ['tblReportClass', ['caption', 'duration', 'user_owner',  'caption_cat_1', 'caption_cat_2', 'caption_cat_3', 'caption_variable'], ['attribute']],
  addVariableCat_1: ['tblVariableCat_1',['caption', 'code', 'weight'], ['attribute']],
  addVariableCat_2: ['tblVariableCat_2', ['caption', 'code', 'variablecat_1_id', 'weight'], ['attribute']],
  addVariableCat_3: ['tblVariableCat_3', ['caption', 'code', 'variablecat_2_id', 'weight'], ['attribute']],
  addVariableDef: ['tblVariableDef', ['unit', 'caption', 'code', 'user_provider', 'user_owner', 'user_reviewer'], ['attribute']],
  addReportClassVariable: ['tblReportClassVariable', ['reportclass_id', 'variabledef_id', 'weight'], ['variableCat_3_id']],
  addReport: ['tblReport', ['reportclass_id', 'title', 'time_limit', 'user_creator', 'ip_user', 'time_create', 'time_reference'], ['pathfile', 'attribute']],
  addVariable: ['tblVariable', ['variabledef_id','user_provider', 'user_owner', 'user_reviewer', 'time_reference'], ['attribute']],
  addReportVariable: ['tblReportVariable', ['report_id', 'variable_id'], ['variableCat_3_id', 'weight']],
  addAttachment: ['tblAttachmentClass', ['variable_id', 'pathfile', 'user_attach', 'ip_user', 'time_attach'], ['attribute']],
  addValue: ['tblPIValue', ['variable_id', 'value', 'time_update', 'user_update', 'ip_user'], ['base', 'attribute']],
  addTarget: ['tblPITarget', ['variable_id', 'value', 'time_target', 'time_update', 'user_update' , 'ip_user'], ['attribute']],
  addMeggesge: ['tblMessage', ['textmessage', 'time_message', 'ip_sender', 'user_sender', 'user_reciever'], ['variable_id', 'time_read', 'attribute']]
};
//insert validator functional
var fvalidate = function (data) {
    var verb = data._verb;
    if (!(verb in insertvalidverbs)) {
        throw('validateForInsert failed, ' + verb + ' not exists');
    } else {
        data._tbl = insertvalidverbs[verb][0];
        data._clmc = (insertvalidverbs[verb][1]).length;
        data._clms = '(' + (insertvalidverbs[verb][1]).toString() + ')';
        data._uclms = insertvalidverbs[verb][2];
        if (!config.get('couldCreateAdmin')) {
            if (verb === 'addUser') {
                data.sysadmin = false;
            }
        }
        return(data);
    }
};
//insert validator with promise
exports.validate = function (data, verb) {
    if (verb !== undefined) {
        data._verb = verb;
    }
    return new Promise((resolve, reject) => {
        try {
          data = fvalidate(data);
          resolve(data);
        } catch(err) {
          reject(err);
        }
    });
};
