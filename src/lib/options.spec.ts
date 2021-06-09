import { getPinoOptions } from './options';
import { APP_CONTEXT_WITH_VERSION } from './targets/_test_utils';
import gcpOptionsGenerator from './targets/gcp';

jest.mock('./targets/gcp');

describe('getPinoOptions', () => {
  test('No options should be returned if no target was specified', () => {
    const options = getPinoOptions();

    expect(options).toEqual({});
  });

  test('GCP options should be used if GCP target was requested', () => {
    const expectedOptions = { foo: 'bar' };
    getMockInstance(gcpOptionsGenerator).mockReturnValue(expectedOptions);
    const options = getPinoOptions('gcp', APP_CONTEXT_WITH_VERSION);

    expect(options).toEqual(expectedOptions);
    expect(gcpOptionsGenerator).toBeCalledWith(APP_CONTEXT_WITH_VERSION);
  });
});

function getMockInstance(mockedObject: any): jest.MockInstance<any, any> {
  return mockedObject as unknown as jest.MockInstance<any, any>;
}
